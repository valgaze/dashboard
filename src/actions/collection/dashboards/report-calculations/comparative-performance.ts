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
  // Figure out the unit that we are comparing with - week, month, or quarter?
  const unit = TYPE_TO_TIME_UNIT[report.settings.type];
  if (!unit) {
    throw new Error(
      `Unknown comparison type ${unit} - must be one of ${Object.keys(TYPE_TO_TIME_UNIT).join(', ')}.`
    );
  }

  const space = objectSnakeToCamel(await core.spaces.get({ id: report.settings.spaceId }));
  const lastStartDate = getCurrentLocalTimeAtSpace(space).startOf(unit).subtract(1, unit);

  // Build array of periods
  const mode = TYPE_TO_MODE[report.settings.type];
  const size = report.settings.size || (mode === COMPARATIVE_WEEK ? 4 : 3);
  const periods: any[] = [];
  for (let i = 0; i < size; i++) {
    const startDate = lastStartDate.clone().subtract(i, unit);
    const endDate = startDate.clone().endOf(unit);
    periods.unshift({ startDate, endDate });
  }

  // For each time range, fetch the data at 1 hour intervals
  const periodCounts = await Promise.all(
    periods.map(period => fetchAllPages(page => {
      return core.spaces.counts({
        id: report.settings.spaceId,
        interval: '1h',
        start_time: formatInISOTimeAtSpace(period.startDate, space),
        end_time: formatInISOTimeAtSpace(period.endDate, space),
        time_segment_groups: report.settings.timeSegmentGroupId,
        page,
        page_size: 5000,
      });
    }))
  );

  const data = periods.map((period, index) => {

    // Calculate peak (hourly) bucket in the period
    const totalsByHour = periodCounts[index].reduce((totals, bucket) => {
      const timestamp = parseISOTimeAtSpace(bucket.timestamp, space);
      const day = timestamp.format('dddd');
      const hour = timestamp.format('ha');
      const hourIndex = totals.findIndex(d => d.day === day && d.hour === hour);
      if (hourIndex >= 0) {
        totals[hourIndex].entrances += bucket.interval.analytics.entrances;
      } else {
        totals.push({ day, hour, entrances: bucket.interval.analytics.entrances });
      }
      return totals;
    }, []);

    // Peak hour(s) in the period
    const busiestHours = totalsByHour.reduce((acc, hour) => {
      if (hour.entrances > 0 && (acc.length == 0 || acc[0].entrances === hour.entrances)) {
        acc.push(hour);
      } else if (hour.entrances > 0 && hour.entrances > acc[0].entrances) {
        acc = [hour];
      }
      return acc;
    }, []);

    // Reduce again to totals by day
    const totalsByDay = totalsByHour.reduce((totals, hour) => {
      const dayIndex = totals.findIndex(d => d.day === hour.day);
      if (dayIndex >= 0) {
        totals[dayIndex].entrances += hour.entrances;
      } else {
        totals.push({ day: hour.day, entrances: hour.entrances });
      }
      return totals;
    }, []);

    // Peak day(s) in the period
    const busiestDays = totalsByDay.reduce((acc, day) => {
      if (day.entrances > 0 && (acc.length == 0 || acc[0].entrances === day.entrances)) {
        acc.push(day);
      } else if (day.entrances > 0 && day.entrances > acc[0].entrances) {
        acc = [day];
      }
      return acc;
    }, []);

    // Sum up the total number of entrances in all buckets ("total visits")
    const totalEntrances = totalsByDay.reduce((sum, day) => sum + day.entrances, 0);

    return {
      totalVisits: totalEntrances,
      busiestDays,
      busiestHours,
      ...period
    };
  });

  return {
    title: report.name,
    space,

    mode,
    data
  };
}
