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

import AppFrameHeader, { AppFrameHeaderText, AppFrameHeaderItem } from '../app-frame-header/index';
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
    <a className="dashboard-sidebar-link" href={`#/dashboards/${id}`}>
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

export function Dashboard({
  dashboards,
  selectedDashboard,

  dashboardReportGridIdentityValue,
  onChangeDashboardReportGridIdentityValue,

  sidebarVisible,
  onChangeSidebarVisibility,
}) {
  return (
    <div className="dashboard-app-frame">
      <div className={classnames('dashboard-app-frame-sidebar-wrapper', {visible: sidebarVisible})}>
        <div className="dashboard-app-frame-sidebar">
          <AppFrameHeader>
            <AppFrameHeaderItem>
              <AppFrameHeaderText>Dashboards</AppFrameHeaderText>
            </AppFrameHeaderItem>
          </AppFrameHeader>
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
        </div>
      </div>
      <div className="dashboard-app-frame-content">
        {(function() {
          if (dashboards.loading && !dashboards.selected) {
            return (
              <AppFrameHeader></AppFrameHeader>
            );
          } else if (!dashboards.selected) {
            return (
              <Fragment>
                <AppFrameHeader>
                  <AppFrameHeaderItem>
                    <DashboardSidebarHideShowIcon
                      sidebarVisible={sidebarVisible}
                      onChangeSidebarVisibility={onChangeSidebarVisibility}
                    />
                  </AppFrameHeaderItem>
                </AppFrameHeader>
                <div className="dashboard-wrapper">
                  <div className="dashboard-non-ideal-state">
                    <h1>No dashboard selected</h1>
                    <span>To create a dashboard, please talk to your Density account manager.</span>
                  </div>
                </div>
              </Fragment>
            );
          } else if (selectedDashboard && selectedDashboard.reportSet.length === 0) {
            return (
              <Fragment>
                <AppFrameHeader>
                  <AppFrameHeaderItem>
                    <DashboardSidebarHideShowIcon
                      sidebarVisible={sidebarVisible}
                      onChangeSidebarVisibility={onChangeSidebarVisibility}
                    />
                  </AppFrameHeaderItem>
                  <AppFrameHeaderItem>
                    <AppFrameHeaderText>{selectedDashboard.name}</AppFrameHeaderText>
                  </AppFrameHeaderItem>
                </AppFrameHeader>
                <div className="dashboard-wrapper">
                  <div className="dashboard-non-ideal-state">
                    <h1>No reports in dashboard</h1>
                    <span>Please talk to your Density account manager to add reports to this dashboard.</span>
                  </div>
                </div>
              </Fragment>
            );
          } else {
            const nonHeaderReports = selectedDashboard.reportSet.filter(r => r.type !== 'HEADER');
            const loadedReports = nonHeaderReports.filter(
              report => dashboards.calculatedReportData[report.id].state !== 'LOADING'
            );
            const isDashboardLoading = loadedReports.length < nonHeaderReports.length;
            if (isDashboardLoading) {
              return (
                <Fragment>
                  <AppFrameHeader>
                    <AppFrameHeaderItem>
                      <DashboardSidebarHideShowIcon
                        sidebarVisible={sidebarVisible}
                        onChangeSidebarVisibility={onChangeSidebarVisibility}
                      />
                    </AppFrameHeaderItem>
                    <AppFrameHeaderItem>
                      <AppFrameHeaderText>{selectedDashboard.name}</AppFrameHeaderText>
                    </AppFrameHeaderItem>
                  </AppFrameHeader>
                  <div className="dashboard-loading-wrapper">
                    <div className="dashboard-loading">
                      <ReportLoading
                        part={loadedReports.length}
                        whole={nonHeaderReports.length}
                      />
                    </div>
                  </div>
                </Fragment>
              );
            }

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

            return (
              <Fragment>
                <AppFrameHeader>
                  <AppFrameHeaderItem>
                    <DashboardSidebarHideShowIcon
                      sidebarVisible={sidebarVisible}
                      onChangeSidebarVisibility={onChangeSidebarVisibility}
                    />
                  </AppFrameHeaderItem>
                  <AppFrameHeaderItem>
                    <AppFrameHeaderText>{selectedDashboard.name}</AppFrameHeaderText>
                  </AppFrameHeaderItem>
                </AppFrameHeader>
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
              </Fragment>
            );
          }
        })()}
      </div>
    </div>
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
