import fetchAllPages from '../../../../helpers/fetch-all-pages/index';
import objectSnakeToCamel from '../../../../helpers/object-snake-to-camel/index';
import {
  formatInISOTimeAtSpace,
  parseISOTimeAtSpace,
} from '../../../../helpers/space-time-utilities/index';
import { core } from '../../../../client';

import { convertTimeRangeToDaysAgo } from './helpers';

export default async function surpassedCapacity(report) {
  const space = objectSnakeToCamel(await core.spaces.get({ id: report.settings.spaceId }));
  const timeSegmentGroup = objectSnakeToCamel(await core.time_segment_groups.get({ id: report.settings.timeSegmentGroupId }));
  const timeRange = convertTimeRangeToDaysAgo(space, report.settings.timeRange);

  if (!space.capacity) {
    throw new Error('A space used with this report requires a capacity.');
  }

  // Find the time segment group and applicable time segment for this space.
  const timeSegmentGroupIds = timeSegmentGroup.timeSegments.map(j => j.timeSegmentId);
  const timeSegment = space.timeSegments.find(i => timeSegmentGroupIds.indexOf(i.id) >= 0);
  if (!timeSegment) {
    throw new Error('Cannot find applicable time segment for time segment group');
  }

  // TODO: This prop shouldn't be nested in timeSegment
  timeSegment.spaces = [space];

  // Fetch the count with the spaces/:id/counts endpoint with an interval of 5 minutes,
  // including the relevant start_time, end_time, and time segment group.
  const minutelyCounts = await fetchAllPages(page => {
    return core.spaces.counts({
      id: report.settings.spaceId,
      interval: '5m',
      start_time: formatInISOTimeAtSpace(timeRange.start, space),
      end_time: formatInISOTimeAtSpace(timeRange.end, space),
      time_segment_groups: report.settings.timeSegmentGroupId,
      page,
      page_size: 5000,
    });
  });

  // Group together all counts fetched into buckets for each day.
  const minutelyBucketsByDay = minutelyCounts.reduce((acc, bucket) => {
    const day = parseISOTimeAtSpace(bucket.timestamp, space).format('YYYY-MM-DD');
    return {
      ...acc,
      [day]: [
        ...(acc[day] || []),
        {
          start: parseISOTimeAtSpace(bucket.interval.start, space).format('HH:mm:ss'),
          end: parseISOTimeAtSpace(bucket.interval.end, space).format('HH:mm:ss'),
          count: bucket.count,
        },
      ],
    }
  }, {});

  const data = [];
  for (let day = timeRange.start.clone(); day.isSameOrBefore(timeRange.end); day = day.clone().add(1, 'day')) {
    data.push(
      minutelyBucketsByDay[day.format('YYYY-MM-DD')] || null /* null = day is not in time segment group */
    );
  }

  return {
    title: report.name,
    startDate: timeRange.start,
    endDate: timeRange.end,
    spaces: [space.name],

    capacity: space.capacity,
    busyOverCapacityThreshold: report.settings.busyOverCapacityThreshold,
    quietBusyThreshold: report.settings.quietBusyThreshold,
    timeSegment,
    timeSegmentGroup,

    data,
  };
}
