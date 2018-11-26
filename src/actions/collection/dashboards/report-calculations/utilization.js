import moment from 'moment';
import fetchAllPages from '../../../../helpers/fetch-all-pages/index';
import objectSnakeToCamel from '../../../../helpers/object-snake-to-camel/index';
import {
  formatInISOTimeAtSpace,
} from '../../../../helpers/space-time-utilities/index';
import { core } from '../../../../client';

import { convertTimeRangeToDaysAgo } from './helpers';

const MOST_UTILIZED = 'MOST_UTILIZED', LEAST_UTILIZED = 'LEAST_UTILIZED';

const REPORT_SETTINGS_MODE_TO_COMPONENT_MODE = {
  'MOST_UTILIZED': MOST_UTILIZED,
  'LEAST_UTILIZED': LEAST_UTILIZED,
};

export default async function utilization(report) {
  const allSpaces = (await fetchAllPages(page => (
    core.spaces.list({page, page_size: 1000})
  ))).map(objectSnakeToCamel);

  const spaces = allSpaces.filter(space => report.settings.spaceIds.indexOf(space.id) >= 0);

  // For each space, fetch the count at a 5 minute interval using the given start time, end time,
  // and time segment group ids.
  const countsBySpace = {
    /* 'spc_xxx': [{timestamp: "...", interval: {...}, count: 100}, ...], */
  };
  await Promise.all(spaces.map(async (space, index) => {
    const timeRange = convertTimeRangeToDaysAgo(space, report.settings.timeRange);
    const responseData = await fetchAllPages(page => {
      return core.spaces.counts({
        id: space.id,
        interval: '5m',
        start_time: formatInISOTimeAtSpace(timeRange.start, space),
        end_time: formatInISOTimeAtSpace(timeRange.end, space),
        time_segment_group_ids: report.settings.timeSegmentGroupId,
        page,
        page_size: 1000,
      });
    });
    countsBySpace[space.id] = {responseData, space};
  }));
  const utilizations = [];
  for (const spaceId in countsBySpace) {
    const space = countsBySpace[spaceId].space;

    if (countsBySpace[spaceId].responseData.length === 0) {
      const timeRange = convertTimeRangeToDaysAgo(space, report.settings.timeRange);
      throw new Error([
        `Space ${space.name} did not return count data when queried for the time range of `,
        `${report.settings.timeRange} (${formatInISOTimeAtSpace(timeRange.start, space)} `,
        `- ${formatInISOTimeAtSpace(timeRange.end, space)})`,
      ].join(''));
    }

    // Calculate the approximate utilization for each space by totalling all the count values in the
    // buckets, and dividing this value by the number of buckets.
    const utilizationsFromCountBuckets = countsBySpace[spaceId].responseData.map(i => i.interval.analytics.utilization / 100);
    const total = utilizationsFromCountBuckets.reduce((a, b) => a + b, 0);

    utilizations.push({
      id: space.id,
      name: space.name,
      utilization: total / utilizationsFromCountBuckets.length,
    });
  }

  // XXX
  // How do we determine which time range to display in the header of the report, given that the
  // time range to be rendered requires a space to be provided?
  // Answer: at the moment, display the time range for the first space.
  const displayedTimeRange = convertTimeRangeToDaysAgo(spaces[0], report.settings.timeRange);
  // XXX

  return {
    title: report.name,
    startDate: displayedTimeRange.start,
    endDate: displayedTimeRange.end,

    mode: REPORT_SETTINGS_MODE_TO_COMPONENT_MODE[report.settings.mode],
    utilizations,
  };
}
