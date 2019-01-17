import React, { Component } from 'react';
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

type ReportProps = {
  report: any;
  reportData: any;
  expanded: boolean;

  onOpenReportExpandedModal: (any) => any;
};

type ReportState = {
	error: Error | null;
	info: any;
}

class Report extends Component<ReportProps, ReportState> {
  state = { error: null, info: null }


  // Note: https://github.com/facebook/create-react-app/issues/3627
  // In development, an error popup will still be shown. This really confused
  // me for a while. but if you close it, you'll see the error boundary state below it.
  componentDidCatch(error, info) {
    this.setState({error, info})
  }

  render() {
    const {
      report,
      reportData,
      expanded,

      onOpenReportExpandedModal,
    }: ReportProps = this.props;

    // If an error was thrown while rendering the component (because this component acts as an
    // error boundary), swap in the report error state instead.
    const { error } = this.state;
    if (error) {
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
    }

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
      let displayContext = {};

      // If the report cannot be expanded, always use the non expanded version of the props
      if (!reportSettings.isExpandable) {
        displayContext = reportSettings.displayContextWhenNotExpanded;

      // Render the correct set of props depending on whether the report is expanded or not
      } else if (expanded) {
        displayContext = reportSettings.displayContextWhenExpanded;
      } else {
        displayContext = reportSettings.displayContextWhenNotExpanded;
      }

      return (
        <ReportComponent
          key={report.id}
          title={report.name}

          // A custom prop that has data used to determine exactly how the report should be rendered.
          displayContext={displayContext}

          // The rest of the props returned from the report calculation
          {...reportData.data}
        />
      );
    default:
      break;
    }

    return (
      <span>Unknown report state {reportData.state}</span>
    );
  }
}

export default connect(state => ({}), dispatch => {
  return {
    // When a user clicks "expand" on a report, call this function to set the currently open modal.
    onOpenReportExpandedModal(report) {
      dispatch(showModal('MODAL_REPORT_EXPANDED', {report}));
    },
  };
})(Report);
