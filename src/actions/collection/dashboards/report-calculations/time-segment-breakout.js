import objectSnakeToCamel from '../../../../helpers/object-snake-to-camel/index';
import {
  getCurrentLocalTimeAtSpace,
  formatInISOTimeAtSpace,
  parseISOTimeAtSpace,
  requestCountsForLocalRange,
} from '../../../../helpers/space-time-utilities/index';
import { core } from '../../../../client';

import { convertTimeRangeToDaysAgo, convertColorToHex } from './helpers';

export default async function averageTimeSegmentBreakdown(report) {
  const space = objectSnakeToCamel(await core.spaces.get({ id: report.settings.spaceId }));
  const timeRange = convertTimeRangeToDaysAgo(space, report.settings.timeRange);

  // Find the time segment group and applicable time segment for this space.
  const timeSegmentGroup = space.timeSegmentGroups.find(i => i.id === report.settings.timeSegmentGroupId);
  if (!timeSegmentGroup) {
    throw new Error('Cannot find time segment group');
  }
  const timeSegmentGroupIds = timeSegmentGroup.timeSegments.map(j => j.timeSegmentId);
  const timeSegment = space.timeSegments.find(i => (
    i.spaces.find(s => s.spaceId === space.id) && timeSegmentGroupIds.indexOf(i.id) >= 0
  ));
  if (!timeSegment) {
    throw new Error('Cannot find applicable time segment for time segment group');
  }

  // Fetch the count with the spaces/:id/counts endpoint with an interval of 5 minutes,
  // including the relevant start_time, end_time, and time segment group.
  const minutelyCountsPromise = await requestCountsForLocalRange(
    space,
    formatInISOTimeAtSpace(timeRange.start, space),
    formatInISOTimeAtSpace(timeRange.end, space),
    {
      interval: '5m',
      order: 'desc',
      page_size: 5000,
      time_segment_groups: report.settings.timeSegmentGroupId,
    }
  );
  const minutelyCounts = minutelyCountsPromise.reverse();

  const countsDump = minutelyCounts.map(c => `${c.timestamp}, ${c.count}, ${c.interval.analytics.entrances}, ${c.interval.analytics.exits}, ${c.interval.analytics.max}, ${c.interval.analytics.min}`);
  countsDump.unshift('timestamp, count, entrances, exits, max, min');
  console.log(countsDump.join('\n'))

  // Group together all counts fetched into buckets for each day.
  const entrancesByDay = {}
  const minutelyBucketsByDay = minutelyCounts.reduce((acc, bucket) => {
    const day = parseISOTimeAtSpace(bucket.timestamp, space).format('YYYY-MM-DD');
    entrancesByDay[day] = (entrancesByDay[day] || 0) + bucket.interval.analytics.entrances;
    return {
      ...acc,
      [day]: [...(acc[day] || []), bucket],
    };
  }, {});

  const entrances = Object.values(entrancesByDay);
  const averageEntrances = Math.round(entrances.reduce((c, n) => c + n, 0) / entrances.length);

  const lines = Object.values(minutelyBucketsByDay).map(line => {
    return line.map((bucket, index) => ({
      timestamp: parseISOTimeAtSpace(bucket.timestamp, space).format('HH:mm:ss'),
      value: bucket.interval.analytics.max,
    }))
  });

  console.log(lines)

  return {
    title: report.name,
    startDate: timeRange.start,
    endDate: timeRange.end,
    spaces: [space.name],
    color: convertColorToHex(report.settings.color),

    timeSegment,
    timeSegmentGroup,
    lines: lines,
    averageEntrances: averageEntrances
  };
}
