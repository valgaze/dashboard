import React from 'react';
import { connect } from 'react-redux';

import Report from '../report/index';

import AppBar from '../app-bar/index';
import AppFrame from '../app-frame/index';
import AppPane from '../app-pane/index';
import AppScrollView from '../app-scroll-view/index';

export function NewExploreDetail({
  spaceIds,
  spaces,
  reports,
  calculatedReportData,
}) {
  return (
    <AppFrame>
      <AppPane>
        <AppBar title="Spaces" />
        <AppScrollView>
          <ul>
            {spaces.data.map(space => {
              if (spaceIds.indexOf(space.id) >= 0) {
                return (
                  <li key={space.id}>
                    [{space.spaceType}] {space.name}{' '}
                    <a href={`#/explore-new/${spaceIds.filter(i => i !== space.id).join(',')}`}>(remove)</a>
                  </li>
                );
              } else {
                return (
                  <li key={space.id}>
                    <a href={`#/explore-new/${[...spaceIds, space.id].join(',')}`}>
                      [{space.spaceType}] {space.name}
                    </a>
                  </li>
                );
              }
            })}
          </ul>
        </AppScrollView>
      </AppPane>
      <AppPane>
        <AppBar title="Space Data" />
        <div className="new-explore-detail">
          {reports.state === 'COMPLETE' && reports.data.length === 0 ? (
            <div>
              <h2>Please select some spaces!</h2>
            </div>
          ) : null}
          {reports.state === 'COMPLETE' && reports.data.length > 0 ? reports.data.map(report => (
            <Report
              key={report.id}
              report={report}
              reportData={calculatedReportData[report.id]}
            />
          )) : null}
          <pre>{JSON.stringify(reports, null, 2)}</pre>
        </div>
      </AppPane>
    </AppFrame>
  );
}

export default connect(state => {
  return {
    spaceIds: state.miscellaneous.exploreSpaceIds,
    spaces: state.spaces,
    reports: state.exploreData.calculations.reports,
    calculatedReportData: state.dashboards.calculatedReportData,
  };
}, dispatch => {
  return {};
})(NewExploreDetail);
