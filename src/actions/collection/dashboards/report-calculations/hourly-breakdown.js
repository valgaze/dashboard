import moment from 'moment';
import fetchAllPages from '../../../../helpers/fetch-all-pages/index';
import objectSnakeToCamel from '../../../../helpers/object-snake-to-camel/index';
import {
  formatInISOTimeAtSpace,
  parseISOTimeAtSpace,
  getCurrentLocalTimeAtSpace,
} from '../../../../helpers/space-time-utilities/index';
import { core } from '../../../../client';

import { convertTimeRangeToDaysAgo } from './helpers';

export default async function totalVisitsOneSpace(report) {
  const space = objectSnakeToCamel(await core.spaces.get({ id: report.settings.spaceId }));
  const timeRange = convertTimeRangeToDaysAgo(space, report.settings.timeRange);

  // Fetch all count data within the time range, specifying an interval of 1 hour
  let data = await fetchAllPages(page => {
    return core.spaces.counts({
      id: report.settings.spaceId,
      interval: '1h',
      start_time: formatInISOTimeAtSpace(timeRange.start, space),
      end_time: formatInISOTimeAtSpace(timeRange.end, space),
      page,
      page_size: 1000,
    });
  });

  // Filter data to remove all buckets with a timerange outside of the start and end hours speicfied
  // in the report settings
  data = data.filter(bucket => {
    const timestamp = parseISOTimeAtSpace(bucket.timestamp, space);
    return report.settings.hourStart <= timestamp.hours() && timestamp.hours() <= report.settings.hourEnd;
  });

  // If the include weekends flag is enabled, then filter out all buckets that occur on weekends.
  if (!report.settings.includeWeekends) {
    data = data.filter(bucket => {
      const timestamp = parseISOTimeAtSpace(bucket.timestamp, space);
      const dayOfWeek = timestamp.format('dddd');
      const isWeekend = ['Saturday', 'Sunday'].indexOf(dayOfWeek) >= 0;
      return !isWeekend;
    });
  }

  // Finally, group together all count buckets fetched into groups, one per day.
  const bucketsByDay = data.reduce((acc, bucket) => {
    const date = parseISOTimeAtSpace(bucket.timestamp, space).format('YYYY-MM-DD');
    const dateIndex = acc.findIndex(d => d.date === date);
    if (dateIndex >= 0) {
      return [
        ...acc.slice(0, dateIndex),
        {
          ...acc[dateIndex],
          buckets: [...acc[dateIndex].buckets, bucket],
        },
        ...acc.slice(dateIndex+1),
      ];
    } else {
      return [
        ...acc,
        {date, buckets: [bucket]},
      ];
    }
  }, []);

  // Prior to passing this data to the component, sort all count buckets in order (they should
  // already be as the data is returned in order already, but it never hurts to be sure) and extract
  // out the entrances from each bucket.
  const dataByDay = bucketsByDay.map(({date, buckets}) => {
    return {
      date: moment.tz(date, "YYYY-MM-DD", space.timeZone),
      values: buckets.sort((a, b) => a.timestamp > b.timestamp).map(i => i.interval.analytics.entrances),
    };
  });

  return {
    title: report.name,
    startDate: timeRange.start,
    endDate: timeRange.end,
    space,

    data: dataByDay,
    dataStartTime: getCurrentLocalTimeAtSpace(space)
      .startOf('day')
      .add(report.settings.hourStart, 'hours'),
  };
}
