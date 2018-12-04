import React, { Fragment } from 'react';

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

import AppFrameColumn from '../app-frame-column/index';

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

export function Dashboard({ dashboards, selectedDashboard }) {
  return (
    <div className="dashboard-app-frame">
      <div className="dashboard-app-column">
        <AppFrameColumn title="Dashboards">
          {(function() {
            if (dashboards.loading) {
              return null;
            } else {
              return (
                <ul>
                  {dashboards.data.map(dashboard => (
                    <li key={dashboard.id}>
                      <a href={`#/dashboards/${dashboard.id}`}>
                        {dashboard.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )
            }
          })()}
        </AppFrameColumn>
      </div>
      <div className="dashboard-app-frame-content">
        {(function() {
          if (dashboards.loading) {
            return (
              <AppFrameColumn title="Loading" />
            );
          } else if (!dashboards.selected) {
            return (
              <AppFrameColumn title="">
                <div className="dashboard-wrapper">
                  <div className="dashboard-non-ideal-state">
                    <h1>No dashboard selected</h1>
                    <span>To create a dashboard, please talk to your Density account manager.</span>
                  </div>
                </div>
              </AppFrameColumn>
            );
          } else {
            const nonHeaderReports = selectedDashboard.reportSet.filter(r => r.type !== 'HEADER');
            const loadedReports = nonHeaderReports.filter(
              report => dashboards.calculatedReportData[report.id].state !== 'LOADING'
            );
            const isDashboardLoading = loadedReports.length < nonHeaderReports.length;
            if (isDashboardLoading) {
              return (
                <AppFrameColumn title={selectedDashboard.name}>
                  <div className="dashboard-loading-wrapper">
                    <div className="dashboard-loading">
                      <ReportLoading
                        part={loadedReports.length}
                        whole={nonHeaderReports.length}
                      />
                    </div>
                  </div>
                </AppFrameColumn>
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
              <AppFrameColumn title={selectedDashboard.name}>
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
                                  id: report.id,
                                  report: (
                                    <span>Loading report</span>
                                  ),
                                };
                              case 'ERROR':
                                return {
                                  id: report.id,
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
                                  id: report.id,
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
              </AppFrameColumn>
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
  };
}, dispatch => {
  return {};
})(Dashboard);
