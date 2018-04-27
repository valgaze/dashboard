import moment from 'moment';

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
const commonRanges = [
    {
        id: WEEK_TO_DATE,
        name: 'Week to date',
        startDate: moment.utc().startOf('week'),
        endDate: moment.utc()
    },
    {
        id: MONTH_TO_DATE,
        name: 'Month to date',
        startDate: moment.utc().startOf('month'),
        endDate: moment.utc()
    },
    {
        id: QUARTER_TO_DATE,
        name: 'Quarter to date',
        startDate: moment.utc().startOf('quarter'),
        endDate: moment.utc()
    },
    {
        id: LAST_WEEK,
        name: 'Last week',
        startDate: moment.utc().startOf('week').subtract(1, 'week'),
        endDate: moment.utc().endOf('week').subtract(1, 'week')
    },
    {
        id: LAST_MONTH,
        name: 'Last month',
        startDate: moment.utc().startOf('month').subtract(1, 'month'),
        endDate: moment.utc().endOf('month').subtract(1, 'month')
    },
    {
        id: LAST_QUARTER,
        name: 'Last Quarter',
        startDate: moment.utc().startOf('quarter').subtract(1, 'quarter'),
        endDate: moment.utc().endOf('quarter').subtract(1, 'quarter')
    },
    {
        id: LAST_7_DAYS,
        name: 'Last 7 days',
        startDate: moment.utc().subtract(1, 'week'),
        endDate: moment.utc()
    },
    {
        id: LAST_30_DAYS,
        name: 'Last 30 days',
        startDate: moment.utc().subtract(1, 'month'),
        endDate: moment.utc()
    },
    {
        id: LAST_90_DAYS,
        name: 'Last 90 days',
        startDate: moment.utc().subtract(1, 'quarter'),
        endDate: moment.utc()
    }
]

export default commonRanges;
