import React from 'react';
import { connect } from 'react-redux';

import REPORTS, { DEFAULT_REPORT_SETTINGS } from '../../reports';

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

import showModal from '../../actions/modal/show';

import { getCurrentLocalTimeAtSpace } from '../../helpers/space-time-utilities/index';

function Report({
  report,
  reportData,
  expanded,

  onOpenReportExpandedModal,
}) {
  const ReportComponent = REPORTS[report.type].component;
  const reportSettingsGenerator = REPORTS[report.type].settings;
  const reportSettings = reportSettingsGenerator ? reportSettingsGenerator({
    report,
    reportData,
    expanded,
    onOpenReportExpandedModal,
  }) : DEFAULT_REPORT_SETTINGS;

  if (!ReportComponent) {
    return (
      <span>Unknown report type {report.type}</span>
    );
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
            displayContext: reportSettings.displayContextWhenExpanded,
          };
        } else {
          return {
            displayContext: reportSettings.displayContextWhenNotExpanded,
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
