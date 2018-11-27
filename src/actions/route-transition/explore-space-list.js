import moment from 'moment';
import { core } from '../../client';
import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';

import { DEFAULT_TIME_SEGMENT_GROUP } from '../../helpers/time-segments/index';
import fetchAllPages from '../../helpers/fetch-all-pages/index';

import { parseISOTimeAtSpace } from '../../helpers/space-time-utilities/index';

import spaceUtilizationPerGroup, {
  groupCountsByDay,
} from '../../helpers/space-utilization/index';

import collectionSpacesSet from '../collection/spaces/set';
import collectionSpacesError from '../collection/spaces/error';
import collectionTimeSegmentGroupsSet from '../collection/time-segment-groups/set';
import collectionTimeSegmentGroupsError from '../collection/time-segment-groups/error';

import exploreDataAddCalculation from '../../actions/explore-data/add-calculation';
import exploreDataCalculateDataLoading from '../../actions/explore-data/calculate-data-loading';
import exploreDataCalculateDataComplete from '../../actions/explore-data/calculate-data-complete';
import exploreDataCalculateDataError from '../../actions/explore-data/calculate-data-error';

export const ROUTE_TRANSITION_EXPLORE_SPACE_LIST = 'ROUTE_TRANSITION_EXPLORE_SPACE_LIST';

// How long should data be fetched when running utilization calculations?
const DATA_DURATION_WEEK = 'DATA_DURATION_WEEK',
      DATA_DURATION_MONTH = 'DATA_DURATION_MONTH';

export default function routeTransitionExploreSpaceList() {
  return async (dispatch, getState) => {
    dispatch({ type: ROUTE_TRANSITION_EXPLORE_SPACE_LIST });
    let errorThrown;


    // Load a list of all spaces
    errorThrown = false;
    let spaces;
    try {
      spaces = (await fetchAllPages(
        page => core.spaces.list({page, page_size: 1000})
      )).map(objectSnakeToCamel);
    } catch (err) {
      errorThrown = true;
      dispatch(collectionSpacesError(`Error loading space: ${err}`));
    }
    if (!errorThrown) {
      dispatch(collectionSpacesSet(spaces));
    }


    // Load a list of all time segment groups, which is required in order to render in the time
    // segment list.
    errorThrown = false;
    let timeSegmentGroups;
    try {
      timeSegmentGroups = await fetchAllPages(
        page => core.time_segment_groups.list({page, page_size: 1000})
      );
    } catch (err) {
      errorThrown = true;
      dispatch(collectionTimeSegmentGroupsError(`Error loading time segments: ${err}`));
    }
    if (!errorThrown) {
      dispatch(collectionTimeSegmentGroupsSet(timeSegmentGroups));
    }


    dispatch(exploreDataAddCalculation('dailyMetrics'));
    dispatch(exploreDataCalculateDataLoading('dailyMetrics'));

    // Next, do all utilization calculations for each space
    const { dataDuration, timeSegmentGroupId } = getState().spaces.filters;

    try {
      const spacesToFetch = spaces;

      // Store if each space has a capacity and therefore can be used to calculate utilization.
      const canSpaceBeUsedToCalculateUtilization = spacesToFetch.reduce((acc, i) => ({...acc, [i.id]: i.capacity !== null}), {})

      // NOTE: The below times don't have timezones. This is purposeful - the
      // `core.spaces.allCounts` call below can accept timezoneless timestamps, which in this case,
      // is desired so that we can get from `startDate` to `endDate` in the timezone of each space,
      // rather than in a fixed timezone between all spaces (since the list of spaces can be in
      // multiple timezones)

      // Get the last full week of data.
      //
      // "Some random month"
      //
      //              1  2
      //  3  4  5  6  7  8
      //  9  10
      //
      // ie, if the current date is the 10th, then the last full week goes from the 3rd to the 8th.
      let startDate,
          endDate = moment.utc().subtract(1, 'week').endOf('week').endOf('day').format('YYYY-MM-DDTHH:mm:ss');

      if (dataDuration === DATA_DURATION_WEEK) {
        startDate = moment.utc().subtract(1, 'week').startOf('week').format('YYYY-MM-DDTHH:mm:ss');
      } else {
        startDate = moment.utc().subtract(1, 'month').format('YYYY-MM-DDTHH:mm:ss');
      }

      // Get all counts within that last full week. Request as many pages as required.
      const data = await fetchAllPages(page => {
        return core.spaces.allCounts({
          start_time: startDate,
          end_time: endDate,
          interval: '10m',
          page,
          page_size: 1000,
          time_segment_groups: timeSegmentGroupId === DEFAULT_TIME_SEGMENT_GROUP.id ? '' : timeSegmentGroupId,
        });
      });

      // Add a `timestampAsMoment` property which converts the timestamp into a moment. This is so
      // that this expensive step doesn't have to be performed on each component render in the
      // `.calculateTotalNumberOfEventsForSpaces` method or have to be performed again below in the
      // utilization calculation.
      for (const spaceId in data) {
        const space = spaces.find(i => i.id === spaceId);


        for (let ct = 0; ct < data[spaceId].length; ct++) {
          data[spaceId][ct].timestampAsMoment = parseISOTimeAtSpace(
            data[spaceId][ct].timestamp,
            space,
          );
        }
      }

      // Utilization calculation.
      // For each space, group counts into buckets, each a single day long.
      const spaceUtilizations = Object.keys(data).reduce((acc, spaceId, ct) => {
        // If a space doesn't have a capacity, don't use it for calculating utilization.
        if (!canSpaceBeUsedToCalculateUtilization[spaceId]) { return acc; }

        const space = spaces.find(i => i.id === spaceId);
        const counts = data[spaceId];

        const groups = groupCountsByDay(counts, space);
        const result = spaceUtilizationPerGroup(space, groups);

        return {
          ...acc,
          [space.id]: result.reduce((acc, i) => acc + i.averageUtilization, 0) / result.length,
        };
      }, {});

      console.log('SPACE COUNTS', data, spaceUtilizations);

      dispatch(exploreDataCalculateDataComplete('dailyMetrics', {
        spaceCounts: data,
        spaceUtilizations,
      }));
    } catch (error) {
      console.error('ERROR', error);
      dispatch(
        exploreDataCalculateDataError('dailyMetrics', `Could not fetch space counts: ${error.message}`)
      );
    }
  };
}
