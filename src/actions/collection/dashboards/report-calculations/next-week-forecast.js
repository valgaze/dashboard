import moment from 'moment';

import objectSnakeToCamel from '../../../../helpers/object-snake-to-camel/index';
import {
  getCurrentLocalTimeAtSpace,
  parseISOTimeAtSpace,
} from '../../../../helpers/space-time-utilities/index';
import { core } from '../../../../client';

export default async function nextWeekForecast(report) {
  const space = objectSnakeToCamel(await core.spaces.get({ id: report.settings.spaceId }));

  const forecast = objectSnakeToCamel(await core.spaces.forecast({
    id: report.settings.spaceId,
    period: report.settings.period,
    time_segment_groups: report.settings.timeSegmentGroupId,
  }));

  if (forecast.length < 1) {
    throw new Error('No data returned from server for forecast.');
  }

  const startDate = parseISOTimeAtSpace(forecast.results[0].timestamp, space);
  const endDate = parseISOTimeAtSpace(forecast.results[forecast.results.length-1].timestamp, space);

  return {
    title: report.name,
    startDate,
    endDate,
    spaces: [space.name],

    busiestDays: forecast.results.reduce(({dates, visits}, bucket) => {
      if (bucket.forecast > visits) {
        return {
          dates: [bucket.timestamp],
          visits: bucket.forecast,
        };
      } else if (bucket.forecast === visits) {
        return {
          dates: [...dates, bucket.timestamp],
          visits,
        };
      } else {
        return {dates, visits};
      }
    }, {dates: [], visits: 0}).dates.map(date => parseISOTimeAtSpace(date, space)),

    predictiveBasisDuration: moment.duration(
      getCurrentLocalTimeAtSpace(space)
        .diff(moment.tz(forecast.predictiveBasisStartDate, space.timeZone))
    ),

    forecast: forecast.results.map(i => ({
      timestamp: parseISOTimeAtSpace(i.timestamp, space),
      visits: i.forecast,
      high: i.high,
      low: i.low,
      stdDev: i.stdDev,
    })),
  };
}
