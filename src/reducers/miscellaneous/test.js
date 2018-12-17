import assert from 'assert';
import miscellaneous from './index';

import showDashboardSidebar from '../../actions/miscellaneous/show-dashboards-sidebar';
import hideDashboardSidebar from '../../actions/miscellaneous/hide-dashboards-sidebar';
import resetDashboardReportGridIdentityValue from '../../actions/miscellaneous/reset-dashboard-report-grid-identity-value';

const INITIAL_STATE = miscellaneous(undefined, {});

describe('miscellaneous', function() {
  it('opens the sidebar', function() {
    const result = miscellaneous(INITIAL_STATE, showDashboardSidebar());
    assert.equal(result.dashboardSidebarVisible, true);
  });
  it('closes the sidebar', function() {
    const result = miscellaneous(INITIAL_STATE, hideDashboardSidebar());
    assert.equal(result.dashboardSidebarVisible, false);
  });
  it('resets the report grid identity value', function() {
    const oldIdentity = INITIAL_STATE.dashboardReportGridIdentityValue;
    const result = miscellaneous(INITIAL_STATE, resetDashboardReportGridIdentityValue());
    /* ensure it has changed */
    assert.notEqual(oldIdentity, result.dashboardReportGridIdentityValue);
  });
});
