import moment from 'moment';

import fetchAllPages from '../../../../helpers/fetch-all-pages/index';
import objectSnakeToCamel from '../../../../helpers/object-snake-to-camel/index';
import {
  getCurrentLocalTimeAtSpace,
  formatInISOTimeAtSpace,
  parseISOTimeAtSpace,
} from '../../../../helpers/space-time-utilities/index';
import { core } from '../../../../client';

import {
  COMPARATIVE_WEEK,
  COMPARATIVE_MONTH,
  COMPARATIVE_QUARTER,
} from '@density/ui-report-comparative-performance';

const TYPE_TO_TIME_UNIT = {
  WEEK: 'weeks',
  MONTH: 'months',
  QUARTER: 'quarters',
};

const TYPE_TO_MODE = {
  WEEK: COMPARATIVE_WEEK,
  MONTH: COMPARATIVE_MONTH,
  QUARTER: COMPARATIVE_QUARTER,
};

export default async function comparativePerformance(report) {
  const space = objectSnakeToCamel(await core.spaces.get({ id: report.settings.spaceId }));

  const nowAtSpace = getCurrentLocalTimeAtSpace(space);

  // Figure out the unit that we are comparing with - week, month, or quarter?
  const unit = TYPE_TO_TIME_UNIT[report.settings.type];
  if (!unit) {
    throw new Error(
      `Unknown comparison type ${unit} - must be one of ${Object.keys(TYPE_TO_TIME_UNIT).join(', ')}.`
    );
  }

  // Figure out the two time ranges we need to query.
  const lastStartDate = nowAtSpace.clone().startOf(unit).subtract(1, unit);
  const lastEndDate = lastStartDate.clone().add(1, unit);

  const previousStartDate = lastStartDate.clone().subtract(1, unit);
  const previousEndDate = previousStartDate.clone().add(1, unit);

  // For each time range, fetch the data at a `5 minute` intervals so we can calculate the average
  // day of time over this range of time.
  const [ lastCounts, previousCounts ] = await Promise.all([
    fetchAllPages(page => { // "Last" range
      return core.spaces.counts({
        id: report.settings.spaceId,
        interval: '5m',
        start_time: formatInISOTimeAtSpace(lastStartDate, space),
        end_time: formatInISOTimeAtSpace(lastEndDate, space),
        time_segment_groups: report.settings.timeSegmentGroupId,
        page,
        page_size: 1000,
      });
    }),
    fetchAllPages(page => { // "Previous" range
      return core.spaces.counts({
        id: report.settings.spaceId,
        interval: '5m',
        start_time: formatInISOTimeAtSpace(previousStartDate, space),
        end_time: formatInISOTimeAtSpace(previousEndDate, space),
        time_segment_groups: report.settings.timeSegmentGroupId,
        page,
        page_size: 1000,
      });
    }),
  ]);

  const [ lastData, previousData ] = [lastCounts, previousCounts].map(counts => {
    // Group together all counts fetched into buckets for each day.
    const bucketsByDay = counts.reduce((acc, bucket) => {
      const day = parseISOTimeAtSpace(bucket.timestamp, space).format('YYYY-MM-DD');
      return {
        ...acc,
        [day]: [...(acc[day] || []), bucket],
      }
    }, {});

    // For each bucket, calculate a peak count and timestamp.
    const peakPerDay = [];
    for (const day in bucketsByDay) {
      const peak = bucketsByDay[day].reduce(
        ({count, timestamp}, bucket) => {
          if (count === null || bucket.interval.analytics.max > count) {
            return { count: bucket.interval.analytics.max, timestamp: bucket.timestamp };
          } else {
            return {count, timestamp};
          }
        },
        {count: null, timestamp: null},
      );
      peakPerDay.push(peak);
    }

    // Finally, average all the counts and timestamps to determine the "average peak count".
    const dayCount = Object.keys(bucketsByDay).length;
    const totalPeakCount = peakPerDay.reduce((acc, i) => acc + i.count, 0)
    const averagePeakCount = Math.round(totalPeakCount / dayCount);

    const totalPeakTime = peakPerDay.reduce((acc, i) => {
      const peakTimeAtSpace = parseISOTimeAtSpace(i.timestamp, space);
      return acc + peakTimeAtSpace.diff(moment(peakTimeAtSpace).startOf('day'), 'seconds');
    }, 0);
    const averagePeakTime = moment.duration(totalPeakTime / dayCount, 'second');

    // Sum up the total number of entrances in all buckets ("total visits")
    const totalEntrances = counts.reduce(
      (sum, bucket) => sum + bucket.interval.analytics.entrances,
      0,
    );

    return {
      totalVisits: totalEntrances,
      averagePeakCount,
      averagePeakTime,
    };
  });

  return {
    title: report.name,
    space,

    mode: TYPE_TO_MODE[report.settings.type],
    lastData,
    previousData,
  };
}
