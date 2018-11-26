import moment from 'moment';
import fetchAllPages from '../../../../helpers/fetch-all-pages/index';
import objectSnakeToCamel from '../../../../helpers/object-snake-to-camel/index';
import {
  formatInISOTimeAtSpace,
} from '../../../../helpers/space-time-utilities/index';
import { core } from '../../../../client';

import { convertTimeRangeToDaysAgo } from './helpers';

export default async function wastedSpace(report) {
  const allSpaces = (
    await fetchAllPages(page => core.spaces.list({page, page_size: 1000}))
  ).map(objectSnakeToCamel);
  const spaces = allSpaces.filter(space => report.settings.spaceIds.indexOf(space.id) >= 0);

  if (spaces.length === 0) {
    throw new Error(`The given space ids weren't found.`);
  }

  // Fetch all count data within the time range, specifying an interval of 1 hour
  const data = {};
  await Promise.all(spaces.map(async space => {
    const timeRange = convertTimeRangeToDaysAgo(space, report.settings.timeRange);

    data[space.id] = await fetchAllPages(page => {
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
  }));

  // Calculate average utilization value across all buckets returned by the query.
  const spaceAverageUtilization = spaces.map(space => {
    const averageUtilization = data[space.id].reduce(
      (acc, bucket) => acc + bucket.interval.analytics.utilization,
      0
    ) / data[space.id].length;
    return averageUtilization;
  });

  const { underutilizedNormalThreshold, normalOverutilizedThreshold } = report.settings;

  const underutilizedPercent = (
    spaceAverageUtilization.filter(i => i < underutilizedNormalThreshold).length
      / spaceAverageUtilization.length
  ) * 100;

  const normalPercent = (
    spaceAverageUtilization.filter(i => underutilizedNormalThreshold < i && i < normalOverutilizedThreshold).length
      / spaceAverageUtilization.length
  ) * 100;

  const overutilizedPercent = (
    spaceAverageUtilization.filter(i => normalOverutilizedThreshold < i).length
      / spaceAverageUtilization.length
  ) * 100;

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
    spaces: spaces.map(i => i.name),

    underutilizedNormalThreshold,
    normalOverutilizedThreshold,

    underutilizedPercent,
    normalPercent,
    overutilizedPercent,
  };
}
