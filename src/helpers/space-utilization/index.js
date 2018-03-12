import moment from 'moment';
import 'moment-timezone'; 

export const TIME_SEGMENTS = {
  WHOLE_DAY: {start: 0, end: 23, name: 'Whole day'},
  WORKING_HOURS: {start: 8, end: 17, name: 'Working hours (8am-5pm)'},

  BEFORE_OPEN: {start: 4, end: 7, name: 'Before open'},
  BREAKFAST: {start: 7, end: 10, name: 'Breakfast'},
  BETWEEN_MEALS: {start: 10, end: 11, name: 'Between meals'},
  LUNCH: {start: 11, end: 14, name: 'Lunch'},
  AFTER_CLOSE: {start: 14, end: 23, name: 'After Close'},
};

export function groupCountsByDay(counts, timezone) {
  // Group counts into buckets, grouping by day.
  // ie, dayCountGroups = {'2018-05-01': [a, b, ...], '2018-05-02': [x, y, z, ...]}
  const dayCountGroups = counts.reduce((groups, i) => {
    const day = moment.utc(i.timestamp).tz(timezone).format('YYYY-MM-DD');
    return {
      ...groups,
      [day]: [...(groups[day] || []), i],
    };
  }, {});

  return Object.keys(dayCountGroups).map(group => {
    return {
      date: group,
      totalVisits: dayCountGroups[group].reduce((acc, i) => acc + i.interval.analytics.entrances, 0),
      counts: dayCountGroups[group],
    };
  });
}

export function groupCountFilter(groups, predicate) {
  return groups.map(group => {
    return {
      ...group,
      counts: group.counts.filter(predicate),
    };
  });
}

export function isWithinTimeSegment(timestamp, timezone, segment) {
  const t = moment.utc(timestamp).tz(timezone);
  const weekday = t.isoWeekday();
  const hour = t.get('hour');
  const result = (
    weekday <= 5 && // Monday - Friday
    hour > segment.start && hour < segment.end // 9am <= hour <= 5pm
  );
  return result;
}

export default function spaceUtilizationPerGroup(space, groups) {
  if (space.capacity == null) {
    throw new Error('Utilization cannot be calculated without a capacity.');
  }

  return groups.map(i => {
    if (i.counts.length === 0) {
      return {date: i.date, utilization: 0, averageUtilization: 0};
    }

    // For each count within the group, calculate the count over the capacity, also referred to as
    // utilization.
    const utilization = i.counts.map(j => j.count / space.capacity);

    // Then, calculate the average utilization value for the whole group.
    const averageUtilization = utilization.reduce((a, b) => a + b) / utilization.length;

    return {date: i.date, utilization, averageUtilization};
  });
}
