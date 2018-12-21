import fetchAllPages from '../../../../helpers/fetch-all-pages/index';
import objectSnakeToCamel from '../../../../helpers/object-snake-to-camel/index';
import {
  formatInISOTimeAtSpace,
  parseISOTimeAtSpace,
  getCurrentLocalTimeAtSpace,
} from '../../../../helpers/space-time-utilities/index';
import { core } from '../../../../client';

// import { convertTimeRangeToDaysAgo } from './helpers';

export default async function horizonChart(report) {
  const allSpaces = (
    await fetchAllPages(page => core.spaces.list({page, page_size: 5000}))
  ).map(objectSnakeToCamel);
  const spaces = allSpaces.filter(space => report.settings.spaceIds.indexOf(space.id) >= 0);

  if (spaces.length === 0) {
    throw new Error(`The given space ids weren't found.`);
  }

  const spaceData = await Promise.all(spaces.map(space => {
    const timeRange = {
      start: getCurrentLocalTimeAtSpace(space).subtract(7, 'days').startOf('day'),
      end: getCurrentLocalTimeAtSpace(space).subtract(7, 'days').endOf('day'),
    };
    return fetchAllPages(async page => (
      core.spaces.counts({
        id: space.id,
        interval: '5m',
        start_time: formatInISOTimeAtSpace(timeRange.start, space),
        end_time: formatInISOTimeAtSpace(timeRange.end, space),
        page,
        page_size: 4998,
      })
    ));
  }));

  // XXX
  // How do we determine which time range to display in the header of the report, given that the
  // time range to be rendered requires a space to be provided?
  // Answer: at the moment, display the time range for the first space.
  const displayedTimeRange = {
    start: getCurrentLocalTimeAtSpace(spaces[0]).subtract(7, 'days').startOf('day'),
    end: getCurrentLocalTimeAtSpace(spaces[0]).subtract(7, 'days').endOf('day'),
  };
  // XXX

  return {
    title: report.name,
    startDate: displayedTimeRange.start,
    endDate: displayedTimeRange.end,
    spaces: spaces.map((space, index) => ({
      id: space.id,
      name: space.name,
      data: spaceData[index].map(bucket => ({
        ...bucket,
        timestamp: parseISOTimeAtSpace(bucket.timestamp, space),
      })),
    })),

    trackCurveType: 'CURVE_BEZIER',
    // trackCurveType: 'CURVE_STEP',
  };
}
