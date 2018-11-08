import fetchAllPages from '../../../../helpers/fetch-all-pages/index';
import objectSnakeToCamel from '../../../../helpers/object-snake-to-camel/index';
import { formatInISOTimeAtSpace } from '../../../../helpers/space-time-utilities/index';
import { core } from '../../../../client';

import { convertTimeRangeToDaysAgo, convertColorToHex } from './helpers';

export default async function totalVisitsOneSpace(report) {
  const space = objectSnakeToCamel(await core.spaces.get({ id: report.settings.spaceId }));
  const timeRange = convertTimeRangeToDaysAgo(space, report.settings.timeRange);

  // Get all time segment groups that are in this report
  const timeSegmentGroupsPromise = fetchAllPages(
    page => core.time_segment_groups.list({page, page_size: 1000})
  );

  // For each time segment group, make a request to the spaces/:id/counts endpoint for a single
  // space with an interval of a day, passing the given time range and the current time segment
  // group.
  const countsPerTimeSegmentPromise = Promise.all(report.settings.timeSegmentGroups.map(tsg => {
    return fetchAllPages(page => {
      return core.spaces.counts({
        id: report.settings.spaceId,
        interval: '1d',
        start_time: formatInISOTimeAtSpace(timeRange.start, space),
        end_time: formatInISOTimeAtSpace(timeRange.end, space),
        time_segment_groups: tsg.id,
        page_size: 1000,
      });
    });
  }));

  const [countsPerTimeSegment, timeSegmentGroupsUnprocessed] = await Promise.all([
    countsPerTimeSegmentPromise,
    timeSegmentGroupsPromise,
  ]);
  const timeSegmentGroups = timeSegmentGroupsUnprocessed.map(objectSnakeToCamel);

  // For each response, take each nth bucket and group them together in a new array. For
  // example, [[a, b], [c, d], [e, f]] becomes [[a, c, e], [b, d, f]].
  //
  // Each array in the first dimension represents each day, and each array in the second
  // dimension represents each segment within each bar
  const segments = [];
  for (let day = timeRange.start.clone(); day.isSameOrBefore(timeRange.end); day = day.clone().add(1, 'day')) {
    const segmentsPerDay = countsPerTimeSegment.map(tsg => {
      // Get the bucket that represents the day for the given time segment group. If no bucket
      // can be found (ie, the time segment group doesn't include that day) then don't render
      // a bar (return null).
      const todaysBucket = tsg.find(bucket => bucket.timestamp.startsWith(day.format('YYYY-MM-DD')));
      return todaysBucket ? todaysBucket.interval.analytics.entrances : null;
    });
    segments.push(segmentsPerDay);
  }

  // Extract all time segment names and colors
  const timeSegmentNames = report.settings.timeSegmentGroups.map(({id}) => timeSegmentGroups.find(t => t.id === id).name);
  const timeSegmentColors = report.settings.timeSegmentGroups.map(i => convertColorToHex(i.color));

  return {
    title: report.name,
    startDate: timeRange.start,
    endDate: timeRange.end,
    spaces: [space.name],
    timeSegmentNames,
    timeSegmentColors,
    segments,
  };
}
