import objectSnakeToCamel from '../../../../helpers/object-snake-to-camel/index';
import {
  getCurrentLocalTimeAtSpace,
  formatInISOTimeAtSpace,
  parseISOTimeAtSpace,
  requestCountsForLocalRange,
} from '../../../../helpers/space-time-utilities/index';
import { core } from '../../../../client';

import { convertTimeRangeToDaysAgo, convertColorToHex } from './helpers';

function calculateDailyAverage(dailyCounts) {
  // Sum up all entrance values within each count bucket in the response. Divide by the number
  // of days long the time range is. This is the "Daily average number of visitors".
  const totalEntrances = dailyCounts.reduce((acc, bucket) => (
    acc + bucket.interval.analytics.entrances
  ), 0);
  return Math.round(totalEntrances / dailyCounts.length);
}

function calculateAverageValues(space, minutelyBucketsByDay, minutelyCounts) {
  const minutelyCountsByDay = {};
  for (let key in minutelyBucketsByDay) {
    // NOTE: the max is needed here so that the peak occupancy point will line up on the line
    minutelyCountsByDay[key] = minutelyBucketsByDay[key].map(b => b.interval.analytics.max);
  }

  // Combine together the same buckets in each day to determine a total for each bucket over
  // the whole time period. This is the first step of calculating the average.
  // ie, [1, 2, 3, 2, 1, 6, 3] <- This is the first group
  //   + [1, 1, 6, 2, 8, 1, 4] <- This is the second group, etc...
  //   = [1, 3, 9, 4, 9, 7, 7]
  //     ^- total
  const numberOfBucketsPerDay = minutelyCountsByDay[Object.keys(minutelyCountsByDay)[0]].length;
  const totalValues = [];
  for (let index = 0; index < numberOfBucketsPerDay; index++) {
    let total = 0;
    for (let key in minutelyCountsByDay) {
      total += minutelyCountsByDay[key][index];
    }
    totalValues.push(total);
  }


  // Perform the second part of the average by dividing each total value by the total number
  // of days that were summed (ie, the number of days of data that were fetched).
  const daysInRange = Object.keys(minutelyCountsByDay).length;
  const averageValues = totalValues.map((i, index) => ({
    timestamp: parseISOTimeAtSpace(minutelyCounts[index].timestamp, space).format('HH:mm:ss'),
    value: i / daysInRange,
  }));

  // Finally, we need to add one final value to the end of the chart since we've been using the
  // start point of each bucket as the timestamp. Because of this, the last datapoint will be at the
  // start of the final bucket, but in actuality, we need to plot the end of the final bucket as
  // well. So, to do this, we add a point to the end of bucket to ensure that the graph is drawn
  // correctly.
  const lastBucket = minutelyCounts[minutelyCounts.length-1];
  averageValues.push({
    timestamp: parseISOTimeAtSpace(lastBucket.interval.end, space).format('HH:mm:ss'),
    value: lastBucket.interval.analytics.min,
  });

  return averageValues;
}

function calculatePeakOccupancy(averageValues) {
  // Next, calculate the "peak occupancy". This is done by finding the max value in the daily
  // counts.
  const dailyCountsBucketTimestamps = averageValues.map(b => b.timestamp);
  const dailyCountsMaxes = averageValues.map(b => b.value);
  const largestBucketIndex = dailyCountsMaxes.indexOf(Math.max.apply(Math, dailyCountsMaxes));

  const peakOccupancyTimestamp = dailyCountsBucketTimestamps[largestBucketIndex];
  const peakOccupancyQuantity = Math.round(dailyCountsMaxes[largestBucketIndex]);

  return [peakOccupancyTimestamp, peakOccupancyQuantity];
}

function calculatePeakRateOfEntry(space, minutelyBucketsByDay) {
  // Then, calculate the "peak rate of entry". This is done by finding the timestamp at each
  // day with the most number of entrances, and then averaging this timestamp to find the
  // average peak rate of entry time. For the value, extract the entrances value from each
  // bucket that has the peak rate of entry timestamp and average them.
  const peakRateOfEntryPerDayTimestamp = [];
  const peakRateOfEntryPerDayValue = [];

  for (let day in minutelyBucketsByDay) {
    const minutelyEntrances = minutelyBucketsByDay[day].map(b => b.interval.analytics.entrances);
    const maxEntranceValue = Math.max.apply(Math, minutelyEntrances);
    const bucketIndex = minutelyEntrances.indexOf(maxEntranceValue);
    peakRateOfEntryPerDayValue.push(maxEntranceValue);

    const timestamp = parseISOTimeAtSpace(minutelyBucketsByDay[day][bucketIndex].timestamp, space);
    peakRateOfEntryPerDayTimestamp.push(
      timestamp.diff(timestamp.clone().startOf('day'), 'milliseconds')
    );
  }

  const peakRateOfEntryTimestamp = getCurrentLocalTimeAtSpace(space)
    .startOf('day')
    .add(
      peakRateOfEntryPerDayTimestamp.reduce((a, b) => a + b, 0) / peakRateOfEntryPerDayValue.length,
      'milliseconds',
    ).format('HH:mm:ss');
  const peakRateOfEntryQuantity = Math.round(
    peakRateOfEntryPerDayValue.reduce((a, b) => a + b, 0) / peakRateOfEntryPerDayValue.length
  );

  return [peakRateOfEntryTimestamp, peakRateOfEntryQuantity];
}

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

  // Make a request to the spaces/:id/counts endpoint for a single space with an interval of a
  // day, passing the given time range and the single given time segment group.
  const dailyCountsPromise = await requestCountsForLocalRange(
    space,
    formatInISOTimeAtSpace(timeRange.start, space),
    formatInISOTimeAtSpace(timeRange.end, space),
    {
      interval: '1d',
      order: 'desc',
      page_size: 1000,
      time_segment_groups: report.settings.timeSegmentGroupId,
    }
  );
  const dailyCounts = dailyCountsPromise.reverse();

  // Fetch the count with the spaces/:id/counts endpoint with an interval of 5 minutes,
  // including the relevant start_time, end_time, and time segment group.
  const minutelyCountsPromise = await requestCountsForLocalRange(
    space,
    formatInISOTimeAtSpace(timeRange.start, space),
    formatInISOTimeAtSpace(timeRange.end, space),
    {
      interval: '5m',
      order: 'desc',
      page_size: 1000,
      time_segment_groups: report.settings.timeSegmentGroupId,
    }
  );
  const minutelyCounts = minutelyCountsPromise.reverse();

  // Group together all counts fetched into buckets for each day.
  const minutelyBucketsByDay = minutelyCounts.reduce((acc, bucket) => {
    const day = parseISOTimeAtSpace(bucket.timestamp, space).format('YYYY-MM-DD');
    return {
      ...acc,
      [day]: [...(acc[day] || []), bucket],
    };
  }, {});

  // Calculate the daily average number of visitors
  const dailyAverage = calculateDailyAverage(dailyCounts);


  // Calculate the "average day" values that are plotted on the chart
  const averageValues = calculateAverageValues(space, minutelyBucketsByDay, minutelyCounts);

  // Find peak occupancy and peak rate of entry
  const [peakOccupancyTimestamp, peakOccupancyQuantity] = calculatePeakOccupancy(averageValues);
  const [peakRateOfEntryTimestamp, peakRateOfEntryQuantity] = calculatePeakRateOfEntry(space, minutelyBucketsByDay);

  return {
    title: report.name,
    startDate: timeRange.start,
    endDate: timeRange.end,
    spaces: [space.name],
    color: convertColorToHex(report.settings.color),

    timeSegment,
    timeSegmentGroup,
    points: averageValues,
    dailyAverage,

    peakRateOfEntryTimestamp,
    peakRateOfEntryQuantity,
    peakOccupancyTimestamp,
    peakOccupancyQuantity,
  };
}
