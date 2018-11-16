import totalVisitsOneSpace from './report-calculations/total-visits-one-space';
import dailyVisitsPerSegment from './report-calculations/daily-visits-per-segment';
import averageTimeSegmentBreakdown from './report-calculations/average-time-segment-breakdown';
import surpassedCapacity from './report-calculations/surpassed-capacity';
import comparativePerformance from './report-calculations/comparative-performance';
import nextWeekForecast from './report-calculations/next-week-forecast';
import utilization from './report-calculations/utilization';

export const COLLECTION_DASHBOARDS_CALCULATE_REPORT_DATA_COMPLETE = 'COLLECTION_DASHBOARDS_CALCULATE_REPORT_DATA_COMPLETE';
export const COLLECTION_DASHBOARDS_CALCULATE_REPORT_DATA_ERROR = 'COLLECTION_DASHBOARDS_CALCULATE_REPORT_DATA_ERROR';

const REPORT_TYPE_TO_FUNCTION = {
  TOTAL_VISITS_ONE_SPACE: totalVisitsOneSpace,
  DAILY_VISITS: dailyVisitsPerSegment,
  TS_BREAKDOWN: averageTimeSegmentBreakdown,
  CAPACITY: surpassedCapacity,
  COMPARE_PERFORMANCE: comparativePerformance,
  NEXT_WEEK: nextWeekForecast,
  UTILIZATION: utilization,
};

export default function collectionDashboardsCalculateReportData(reports) {
  return async (dispatch) => {
    return Promise.all(reports.map(async report => {
      switch (report.type) {
      case 'HEADER':
        dispatch({
          type: COLLECTION_DASHBOARDS_CALCULATE_REPORT_DATA_COMPLETE,
          report,
          data: null, /* headers don't need data */
        });
        break;

      // The below three "reports" are used in the tests to validate the interaction between the
      // actions and reducers works properly.
      case 'NOOP_DOES_NOTHING':
        break;

      case 'NOOP_COMPLETES_IMMEDIATELY':
        dispatch({
          type: COLLECTION_DASHBOARDS_CALCULATE_REPORT_DATA_COMPLETE,
          report,
          data: {
            hello: 'world',
          },
        });
        break;

      case 'NOOP_ERRORS_IMMEDIATELY':
        dispatch({
          type: COLLECTION_DASHBOARDS_CALCULATE_REPORT_DATA_ERROR,
          report,
          error: new Error('Error was thrown during calculation'),
        });
        break;

      default:
        let data, errorThrown = false;

        const reportDataCalculationFunction = REPORT_TYPE_TO_FUNCTION[report.type];
        if (!reportDataCalculationFunction) {
          dispatch({
            type: COLLECTION_DASHBOARDS_CALCULATE_REPORT_DATA_ERROR,
            report,
            error: `No data calculation function found for a report with type ${report.type}!`,
          });
          return;
        }

        try {
          data = await reportDataCalculationFunction(report);
        } catch (err) {
          errorThrown = err;
        }

        if (errorThrown) {
          // Log the error so a developer can see what whent wrong.
          console.error(errorThrown); // DON'T REMOVE ME!
          dispatch({
            type: COLLECTION_DASHBOARDS_CALCULATE_REPORT_DATA_ERROR,
            report,
            error: errorThrown.message,
          });
        } else {
          dispatch({
            type: COLLECTION_DASHBOARDS_CALCULATE_REPORT_DATA_COMPLETE,
            report,
            data,
          });
        }
      }
    }));
  };
}
