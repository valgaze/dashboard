import moment from 'moment';
import 'moment-timezone'; 

import {
  parseISOTimeAtSpace,
  formatDayAtSpace,
} from '../space-time-utilities/index';

export function groupCountsByDay(counts, space) {
  // Group counts into buckets, grouping by day.
  // ie, dayCountGroups = {'2018-05-01Z': [a, b, ...], '2018-05-02Z': [x, y, z, ...]}
  const dayCountGroups = counts.reduce((groups, i) => {
    const day = formatDayAtSpace(parseISOTimeAtSpace(i.timestamp, space), space);
    return {
      ...groups,
      [day]: [...(groups[day] || []), i],
    };
  }, {});

  return Object.keys(dayCountGroups).map(group => {
    return {
      date: group,
      totalVisits: dayCountGroups[group].reduce((acc, i) => {
        return acc + i.interval.analytics.entrances;
      }, 0),
      counts: dayCountGroups[group],
    };
  });
}

export function isWithinTimeSegment(timestamp, timezone, segment) {
  const t = timestamp instanceof moment ? timestamp : moment.utc(timestamp).tz(timezone);
  const hour = t.get('hour');
  const result = (
    hour >= segment.start && hour <= segment.end // 9am <= hour <= 5pm
  );
  return result;
}

export default function spaceUtilizationPerGroup(space, groups) {
  if (space.capacity == null) {
    throw new Error('Utilization cannot be calculated without a capacity.');
  }

  return groups.map(i => {
    if (i.counts.length === 0) {
      return {date: i.date, utilization: [], averageUtilization: 0};
    }

    // For each count within the group, calculate the count over the capacity, also referred to as
    // utilization.
    const utilization = i.counts.map(j => j.count / space.capacity);

    // Then, calculate the average utilization value for the whole group.
    const averageUtilization = utilization.reduce((a, b) => a + b) / utilization.length;

    return {date: i.date, utilization, averageUtilization};
  });
}
