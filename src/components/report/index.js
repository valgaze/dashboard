import React from 'react';
import { connect } from 'react-redux';

import ReportWrapper, { ReportError } from '@density/ui-report-wrapper';

import ReportAverageMeetingSize from '@density/ui-report-average-meeting-size';
import ReportTimeSegmentBreakdown from '@density/ui-report-time-segment-breakdown';
import ReportTotalVisits from '@density/ui-report-total-visits';
import ReportTotalVisitsRollup from '@density/ui-report-total-visits-rollup';
import ReportDailyVisitsPerSegment from '@density/ui-report-daily-visits-per-segment';
import ReportSurpassedCapacity from '@density/ui-report-surpassed-capacity';
import ReportComparativePerformance from '@density/ui-report-comparative-performance';
import ReportNextWeekForecast from '@density/ui-report-next-week-forecast';
import ReportUtilization from '@density/ui-report-utilization';
import ReportHourlyBreakdown from '@density/ui-report-hourly-breakdown';
import ReportWastedSpace from '@density/ui-report-wasted-space';
import ReportHorizonChart from '../../density-ui-integration/ui-report-horizon-chart';

import showModal from '../../actions/modal/show';

import { getCurrentLocalTimeAtSpace } from '../../helpers/space-time-utilities/index';

// A Report is a small card shaped element rendered to visualize density data.
// There are three concepts that relate to reports:
// - The "report", which is the value returned from the api when we make a request to GET /reports
// or GET /reports/:id
// - The "report data", which is generated by a "report calculation" for the given report type. This
// data contains the values that are used to render the graphs and visualizations within the report.
// - The "report settings", which contains a way to change props passed to a report given parameters
// configured at the time of report render. A great example - two reports can render the same report
// data, but one may be "expanded", and one may not be. This shouldn't be in the "report data",
// since it can change depending on situation the report is rendered in.

// Add new report types here, mapping to their component.
// NOTE: if the report is expandable, add the correct properties to the REPORT_TYPE_TO_SETTINGS
// structure below to!
const REPORT_TYPE_TO_COMPONENT = {
  AVG_MEETING: ReportAverageMeetingSize,
  TOTAL_VISITS_ONE_SPACE: ReportTotalVisits,
  TOTAL_VISITS_MULTI_SPACE: ReportTotalVisitsRollup,
  DAILY_VISITS: ReportDailyVisitsPerSegment,
  TS_BREAKDOWN: ReportTimeSegmentBreakdown,
  CAPACITY: ReportSurpassedCapacity,
  COMPARE_PERFORMANCE: ReportComparativePerformance,
  NEXT_WEEK: ReportNextWeekForecast,
  UTILIZATION: ReportUtilization,
  HOURLY_BREAKDOWN: ReportHourlyBreakdown,
  WASTED_SPACE: ReportWastedSpace,
	HORIZON_CHART: ReportHorizonChart,
};



function Report({
  report,
  reportData,
  expanded,

  onOpenReportExpandedModal,
}) {
  const REPORT_TYPE_TO_SETTINGS = {
    /*
    MY_REPORT_TYPE: {
      // Can this report be expanded and contracted? Defaults to false.
      isExpandable: true | false,

      // When expanded, specify these display context props to the component.
      displayContextWhenExpanded: report => ({ foo: 'i am big!' }),

      // When not expanded, specify these other display context props to the component.
      displayContextWhenNotExpanded: report => ({ foo: 'i am small.'}),
    },
    */
    TOTAL_VISITS_MULTI_SPACE: {
      isExpandable: true,
      displayContextWhenExpanded: report => ({
        showExpandControl: false,
        maximumNumberOfRows: null, /* an unlimited amount of rows */
      }),
      displayContextWhenNotExpanded: report => ({
        showExpandControl: true,
        onReportExpand: () => onOpenReportExpandedModal(report),
        maximumNumberOfRows: 7,
      }),
    },

    UTILIZATION: {
      isExpandable: true,
      displayContextWhenExpanded: report => ({
        showExpandControl: false,
        maximumNumberOfRows: null, /* an unlimited amount of rows */
      }),
      displayContextWhenNotExpanded: report => ({
        showExpandControl: true,
        onReportExpand: () => onOpenReportExpandedModal(report),
        maximumNumberOfRows: 7,
      }),
    },

    HOURLY_BREAKDOWN: {
      isExpandable: true,

      // When expanded, override the hours in the day shown.
      displayContextWhenExpanded: (report, reportData) => ({
        showExpandControl: false,
        dataStartTime: getCurrentLocalTimeAtSpace(reportData.data.space).startOf('day'),
        dataEndTime: getCurrentLocalTimeAtSpace(reportData.data.space).endOf('day'),
      }),

      // When not expanded, show the expand control.
      displayContextWhenNotExpanded: (report, reportData) => ({
        showExpandControl: true,
        onReportExpand: () => onOpenReportExpandedModal(report),

        dataStartTime: getCurrentLocalTimeAtSpace(reportData.data.space)
          .startOf('day')
          .add(report.settings.hourStart, 'hours'),
        dataEndTime: getCurrentLocalTimeAtSpace(reportData.data.space)
          .startOf('day')
          .add(report.settings.hourEnd, 'hours'),
      }),
    },

    HORIZON_CHART: {
      isExpandable: true,

      // When expanded, define the height of each horizon chart to be large.
      displayContextWhenExpanded: (report, reportData) => ({
        showExpandControl: false,
        trackHeight: 54,
        trackVerticalSpacing: 12,
      }),

      // When not expanded, show the expand control and make the height of each
      // horizon chart small.
      displayContextWhenNotExpanded: (report, reportData) => ({
        showExpandControl: true,
        onReportExpand: () => onOpenReportExpandedModal(report),
        trackHeight: 24,
        trackVerticalSpacing: 8,
      }),
    },
  };

  // If a report is not in the above mapping, then default to these report settings.
  const DEFAULT_REPORT_TYPE_SETTINGS = {
    isExpandable: false,
    displayContextWhenExpanded: () => ({}),
    displayContextWhenNotExpanded: () => ({}),
  };

  const ReportComponent = REPORT_TYPE_TO_COMPONENT[report.type];
  const reportSettings = (
    REPORT_TYPE_TO_SETTINGS[report.type] || DEFAULT_REPORT_TYPE_SETTINGS
  );

  if (!ReportComponent) {
    return <span>Unknown report type {report.type}</span>;
  }

  switch (reportData.state) {
  case 'LOADING':
    return (
      <span>Loading report</span>
    );
  case 'ERROR':
    return (
      <ReportWrapper
        title={report.name}
        startDate={null}
        endDate={null}
        hideDetailsLink={true}
          spaces={[]}
      >
        <ReportError />
      </ReportWrapper>
    );
  case 'COMPLETE':
    const reportProps = {
      /* inject return data that calculated by data calculations as props */
      ...reportData.data,

      /* inject custom props when a report is expandable */
      ...(() => {
        // If the report cannot be expanded, always use the non expanded version of the props
        if (!reportSettings.isExpandable) {
          return {
            displayContext: reportSettings.displayContextWhenNotExpanded(report, reportData)
          };
        }

        // Render the correct set of props depending on whether the report is expanded or not
        if (expanded) {
          return {
            displayContext: reportSettings.displayContextWhenExpanded(report, reportData)
          };
        } else {
          return {
            displayContext: reportSettings.displayContextWhenNotExpanded(report, reportData)
          };
        }
      })(),
    };
    return (
      <ReportComponent
        key={report.id}
        title={report.name}
        {...reportProps}
      />
    );
  default:
    break;
  }

  return (
    <span>Unknown report state {reportData.state}</span>
  );
}

export default connect(state => ({}), dispatch => {
  return {
    // When a user clicks "expand" on a report, call this function to set the currently open modal.
    onOpenReportExpandedModal(report) {
      dispatch(showModal('MODAL_REPORT_EXPANDED', {report}));
    },
  };
})(Report);
