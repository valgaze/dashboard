import { core } from '../../client';

import collectionSpacesSet from '../collection/spaces/set';
import collectionSpacesError from '../collection/spaces/error';
import collectionSpacesFilter from '../collection/spaces/filter';
import collectionTimeSegmentGroupsSet from '../collection/time-segment-groups/set';
import collectionTimeSegmentGroupsError from '../collection/time-segment-groups/error';
import collectionSpacesSetDefaultTimeRange from '../collection/spaces/set-default-time-range';

import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';
import fetchAllPages from '../../helpers/fetch-all-pages/index';

import exploreDataCalculateDataLoading from '../../actions/explore-data/calculate-data-loading';
import exploreDataCalculateDataComplete from '../../actions/explore-data/calculate-data-complete';
import exploreDataCalculateDataError from '../../actions/explore-data/calculate-data-error';

import {
  getCurrentLocalTimeAtSpace,
  parseISOTimeAtSpace,
  formatInISOTimeAtSpace,
  getDurationBetweenMomentsInDays,
  requestCountsForLocalRange
} from '../../helpers/space-time-utilities/index';

import {
  DEFAULT_TIME_SEGMENT_GROUP,
  DEFAULT_TIME_SEGMENT,
  findTimeSegmentInTimeSegmentGroupForSpace,
  parseTimeInTimeSegmentToSeconds,
} from '../../helpers/time-segments/index';

export const ROUTE_TRANSITION_EXPLORE_SPACE_DAILY = 'ROUTE_TRANSITION_EXPLORE_SPACE_DAILY';

export default function routeTransitionExploreSpaceDaily(id) {
  return async dispatch => {
    // Prior to changing the active page, change the module state to be loading.
    dispatch(exploreDataCalculateDataLoading('footTraffic'));

    // Change the active page
    dispatch({ type: ROUTE_TRANSITION_EXPLORE_SPACE_DAILY, id });

    // Load a list of all time segment groups, which is required in order to render in the time
    // segment list.
    let timeSegmentGroups;
    try {
      timeSegmentGroups = await core.time_segment_groups.list();
    } catch (err) {
      dispatch(collectionTimeSegmentGroupsError(`Error loading time segments: ${err.message}`));
      return;
    }
    dispatch(collectionTimeSegmentGroupsSet(timeSegmentGroups.results));

    // Ideally, we'd load a single space (since the view only pertains to one space). But, we need
    // every space to traverse through the space hierarchy and render a list of parent spaces on
    // this view unrfortunately.
    let spaces, selectedSpace;
    try {
      spaces = (await fetchAllPages(
        page => core.spaces.list({page, page_size: 1000})
      )).map(objectSnakeToCamel);
      selectedSpace = spaces.find(s => s.id === id);
    } catch (err) {
      dispatch(collectionSpacesError(`Error loading space: ${err.message}`));
      return;
    }

    dispatch(collectionSpacesSetDefaultTimeRange(selectedSpace));
    dispatch(collectionSpacesSet(spaces));

    dispatch(collectionSpacesFilter(
      'date',
      formatInISOTimeAtSpace(getCurrentLocalTimeAtSpace(selectedSpace).startOf('day'), selectedSpace),
    ));

    dispatch(calculate(selectedSpace));
  }
}

export function calculate(space) {
  return dispatch => {
    dispatch(calculateFootTraffic(space));
  };
}

export function calculateFootTraffic(space) {
  return async (dispatch, getState) => {
    // Mark the foot traffic card as in a loading state
    dispatch(exploreDataCalculateDataLoading('footTraffic'));

    const {
      date,
      timeSegmentGroupId,
    } = getState().spaces.filters

    const day = parseISOTimeAtSpace(date, space);

    let data;
    try {
      data = await fetchAllPages(page => (
        core.spaces.counts({
          id: space.id,

          interval: '5m',
          time_segment_groups: timeSegmentGroupId === DEFAULT_TIME_SEGMENT_GROUP.id ? '' : timeSegmentGroupId,
          order: 'desc',

          start_time: formatInISOTimeAtSpace(day.clone().startOf('day'), space),
          end_time: formatInISOTimeAtSpace(day.clone().startOf('day').add(1, 'day'), space),

          page,
          page_size: 1000,
        })
      ));
    } catch (err) {
      dispatch(exploreDataCalculateDataError('footTraffic', err));
    }

    if (data.length > 0) {
      dispatch(exploreDataCalculateDataComplete('footTraffic', data));
    } else {
      dispatch(exploreDataCalculateDataComplete('footTraffic', null));
    }
  }
}
