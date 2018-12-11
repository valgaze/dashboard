import React, { Fragment } from 'react';
import classnames from 'classnames';

import { connect } from 'react-redux';

import DashboardReportGrid from '@density/ui-dashboard-report-grid';

import ReportWrapper, { ReportError } from '@density/ui-report-wrapper';

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

import ReportLoading from '@density/ui-report-loading';

import AppBar from '../app-bar/index';
import AppFrame from '../app-frame/index';
import AppPane from '../app-pane/index';
import AppScrollView from '../app-scroll-view/index';
import AppSidebar from '../app-sidebar/index';
import { IconMenu, IconChevronRight } from '@density/ui-icons';

import showDashboardSidebar from '../../actions/miscellaneous/show-dashboards-sidebar';
import hideDashboardSidebar from '../../actions/miscellaneous/hide-dashboards-sidebar';
import resetDashboardReportGridIdentityValue from '../../actions/miscellaneous/reset-dashboard-report-grid-identity-value';

const REPORT_TYPE_TO_COMPONENT = {
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
};

function DashboardSidebarItem({selected, id, name, reportSet}) {
  const nonHeaderReports = reportSet.filter(i => i.type !== 'HEADER');
  const headerNames = reportSet.filter(i => i.type === 'HEADER').map(i => i.name);
  return (
    <a className="dashboard-app-frame-sidebar-list-item" href={`#/dashboards/${id}`}>
      <div className={classnames('dashboard-sidebar-item', {selected})}>
        <div className="dashboard-sidebar-item-row">
          <span className="dashboard-sidebar-item-name">{name}</span>
          <span className="dashboard-sidebar-item-num-reports">
            {nonHeaderReports.length} {nonHeaderReports.length === 1 ? 'Report' : 'Reports'}
          </span>
          <IconChevronRight width={8} height={8} />
        </div>
        <div className="dashboard-sidebar-item-row">
          <span className="dashboard-sidebar-item-headers">
            {headerNames.length > 0 ? headerNames.join(', ') : "No headers"}
          </span>
        </div>
      </div>
    </a>
  );
}

function DashboardSidebarHideShowIcon({sidebarVisible, onChangeSidebarVisibility}) {
  return (
    <span
      className="dashboard-sidebar-hide-show-icon"
      onClick={() => onChangeSidebarVisibility(!sidebarVisible)}
    >
      <IconMenu />
    </span>
  );
}

function MainScrollViewContent({
  dashboards,
  selectedDashboard,
  dashboardReportGridIdentityValue
}) {
  if (!dashboards.selected && !dashboards.loading) {
    return <div className="dashboard-non-ideal-state">
      <h1>No dashboard selected</h1>
      <span>To create a dashboard, please talk to your Density account manager.</span>
    </div>;
  } else if (selectedDashboard && selectedDashboard.reportSet.length === 0) {
    return <div className="dashboard-non-ideal-state">
      <h1>No reports in dashboard</h1>
      <span>To add reports to this dashboard, please talk to your Density account manager.</span>
    </div>;
  } else if (selectedDashboard && selectedDashboard.reportSet.length > 0) {
    const nonHeaderReports = selectedDashboard.reportSet.filter(r => r.type !== 'HEADER');
    const loadedReports = nonHeaderReports.filter(
      report => dashboards.calculatedReportData[report.id].state !== 'LOADING'
    );
    const isDashboardLoading = loadedReports.length < nonHeaderReports.length;
    if (isDashboardLoading) {
      return <div className="dashboard-loading-wrapper">
        <div className="dashboard-loading">
          <ReportLoading
            part={loadedReports.length}
            whole={nonHeaderReports.length}
          />
        </div>
      </div>;
    } else {
      const reportSections = selectedDashboard.reportSet.reduce((sections, report) => {
        if (report.type === 'HEADER') {
          // Create a new section
          return [ ...sections, {id: report.id, name: report.name, contents: []} ];
        } else {
          // Add report to last existing section
          return [
            ...sections.slice(0, -1),
            {
              ...sections[sections.length-1],
              contents: [...sections[sections.length-1].contents, report],
            },
          ];
        }
      }, [ {id: 'rpt_initial', name: null, contents: []} ]);
  
      return <div>
        {reportSections.map(({id, name, contents}) => (
          <div key={id} className="dashboard-wrapper">
            {contents.length > 0 ? <div className="dashboard-wrapper-inner">
              {name !== null ? <h1 className="dashboard-header">{name}</h1> : null}
              <div>
                <DashboardReportGrid
                  reports={[
                    ...contents.map((report, index) => {
                      const ReportComponent = REPORT_TYPE_TO_COMPONENT[report.type];
                      const reportData = dashboards.calculatedReportData[report.id];

                      if (!ReportComponent) {
                        return {
                          id: report.id,
                          report: (
                            <span>Unknown report type {report.type}</span>
                          )
                        };
                      }

                      switch (reportData.state) {
                      case 'LOADING':
                        return {
                          id: `${report.id}-${dashboardReportGridIdentityValue}`,
                          report: (
                            <span>Loading report</span>
                          ),
                        };
                      case 'ERROR':
                        return {
                          id: `${report.id}-${dashboardReportGridIdentityValue}`,
                          report: (
                            <ReportWrapper
                              title={report.name}
                              startDate={null}
                              endDate={null}
                              hideDetailsLink={true}
                                spaces={[]}
                            >
                              <ReportError />
                            </ReportWrapper>
                          ),
                        };
                      case 'COMPLETE':
                        return {
                          id: `${report.id}-${dashboardReportGridIdentityValue}`,
                          report: (
                            <ReportComponent
                              key={report.id}
                              title={report.name}
                              {...reportData.data}
                            />
                          ),
                        };
                      default:
                        break;
                      }

                      return {
                        id: report.id,
                        report: (
                          <span>Unknown report state {reportData.state}</span>
                        ),
                      };
                    }),
                  ]}
                />
              </div>
            </div> : null}

          </div>
        ))}
        <div className="dashboard-app-frame-scroll-body-spacer" />
      </div>;
    }
  } else {
    return null;
  }
}

export function Dashboard({
  dashboards,
  selectedDashboard,
  dashboardReportGridIdentityValue,

  sidebarVisible,
  onChangeSidebarVisibility,
}) {
  return (
    <AppFrame>
      <AppSidebar visible={sidebarVisible}>
        <AppBar title="Dashboards" />
        <AppScrollView>
          <nav className="dashboard-app-frame-sidebar-list">
            {(function() {
              if (dashboards.loading) {
                return null;
              } else {
                return (
                  <Fragment>
                    {dashboards.data.map(dashboard => (
                      <DashboardSidebarItem
                        key={dashboard.id}
                        id={dashboard.id}
                        name={dashboard.name}
                        reportSet={dashboard.reportSet}
                        selected={selectedDashboard ? selectedDashboard.id === dashboard.id : false}
                      />
                    ))}
                  </Fragment>
                )
              }
            })()}
          </nav>
        </AppScrollView>
      </AppSidebar>
      <AppPane>
        <AppBar title={dashboards.selected ? selectedDashboard.name : ""} />
        <AppScrollView>
          <MainScrollViewContent
            dashboards={dashboards}
            selectedDashboard={selectedDashboard}
            dashboardReportGridIdentityValue={dashboardReportGridIdentityValue} />
        </AppScrollView>
      </AppPane>
    </AppFrame>
  );
}

export default connect(state => {
  const selectedDashboard = state.dashboards.data.find(d => d.id === state.dashboards.selected);
  return {
    dashboards: state.dashboards,
    selectedDashboard,
    sidebarVisible: state.miscellaneous.dashboardSidebarVisible,
    dashboardReportGridIdentityValue: state.miscellaneous.dashboardReportGridIdentityValue,
  };
}, dispatch => {
  return {
    onChangeSidebarVisibility(visibleState) {
      if (visibleState) {
        dispatch(showDashboardSidebar());
      } else {
        dispatch(hideDashboardSidebar());
      }

      // Once the animation has completed, force a relayout
      setTimeout(() => {
        dispatch(resetDashboardReportGridIdentityValue());
      }, 300);
    },
  };
})(Dashboard);
