import { getCurrentLocalTimeAtSpace } from '../space-time-utilities';

// range ids
export const WEEK_TO_DATE = 'WEEK_TO_DATE',
             MONTH_TO_DATE = 'MONTH_TO_DATE',
             QUARTER_TO_DATE = 'QUARTER_TO_DATE',
             LAST_WEEK = 'LAST_WEEK',
             LAST_MONTH = 'LAST_MONTH',
             LAST_QUARTER = 'LAST_QUARTER',
             LAST_7_DAYS = 'LAST_7_DAYS',
             LAST_30_DAYS = 'LAST_30_DAYS',
             LAST_90_DAYS = 'LAST_90_DAYS';

// definition of common ranges
// used by the DateRangePicker
// name, startDate, and endDate used by the DateRangePicker
// key used to filter ranges in the dashboard
export default function getCommonRangesForSpace(space) {
  const YESTERDAY = getCurrentLocalTimeAtSpace(space).subtract(1, 'day').endOf('day');
  return [
    {
      id: WEEK_TO_DATE,
      name: 'Week to date',
      startDate: getCurrentLocalTimeAtSpace(space).startOf('week'),
      endDate: YESTERDAY,
    },
    {
      id: MONTH_TO_DATE,
      name: 'Month to date',
      startDate: getCurrentLocalTimeAtSpace(space).startOf('month'),
      endDate: YESTERDAY,
    },
    {
      id: QUARTER_TO_DATE,
      name: 'Quarter to date',
      startDate: getCurrentLocalTimeAtSpace(space).startOf('quarter'),
      endDate: YESTERDAY,
    },
    {
      id: LAST_WEEK,
      name: 'Last week',
      startDate: getCurrentLocalTimeAtSpace(space).subtract(1, 'week').startOf('week'),
      endDate: getCurrentLocalTimeAtSpace(space).subtract(1, 'week').endOf('week'),
    },
    {
      id: LAST_MONTH,
      name: 'Last month',
      startDate: getCurrentLocalTimeAtSpace(space).subtract(1, 'month').startOf('month'),
      endDate: getCurrentLocalTimeAtSpace(space).subtract(1, 'month').endOf('month'),
    },
    {
      id: LAST_QUARTER,
      name: 'Last Quarter',
      startDate: getCurrentLocalTimeAtSpace(space).subtract(1, 'quarter').startOf('quarter'),
      endDate: getCurrentLocalTimeAtSpace(space).subtract(1, 'quarter').endOf('quarter'),
    },
    {
      id: LAST_7_DAYS,
      name: 'Last 7 days',
      startDate: getCurrentLocalTimeAtSpace(space).subtract(7, 'days').startOf('day'),
      endDate: YESTERDAY,
    },
    {
      id: LAST_30_DAYS,
      name: 'Last 30 days',
      startDate: getCurrentLocalTimeAtSpace(space).subtract(30, 'days').startOf('day'),
      endDate: YESTERDAY,
    },
    {
      id: LAST_90_DAYS,
      name: 'Last 90 days',
      startDate: getCurrentLocalTimeAtSpace(space).subtract(90, 'days').startOf('day'),
      endDate: YESTERDAY,
    },
  ];
}
