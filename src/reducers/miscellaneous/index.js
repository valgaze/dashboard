import uuid from 'uuid';

import { REDIRECT_AFTER_LOGIN } from '../../actions/miscellaneous/redirect-after-login';
import { SHOW_DASHBOARDS_SIDEBAR } from '../../actions/miscellaneous/show-dashboards-sidebar';
import { HIDE_DASHBOARDS_SIDEBAR } from '../../actions/miscellaneous/hide-dashboards-sidebar';
import { RESET_DASHBOARD_REPORT_GRID_IDENTITY_VALUE } from '../../actions/miscellaneous/reset-dashboard-report-grid-identity-value';

import { ROUTE_TRANSITION_EXPLORE_NEW_DETAIL } from '../../actions/route-transition/explore-new-detail';

const initialState = {
  redirectAfterLogin: null,
  dashboardSidebarVisible: true,
  dashboardReportGridIdentityValue: uuid.v4(),
  exploreSpaceIds: [],
};

export default function miscellaneous(state=initialState, action) {
  switch (action.type) {
    case REDIRECT_AFTER_LOGIN:
      return { ...state, redirectAfterLogin: action.hash };
    case SHOW_DASHBOARDS_SIDEBAR:
      return { ...state, dashboardSidebarVisible: true };
    case HIDE_DASHBOARDS_SIDEBAR:
      return { ...state, dashboardSidebarVisible: false };
    case RESET_DASHBOARD_REPORT_GRID_IDENTITY_VALUE:
      return { ...state, dashboardReportGridIdentityValue: uuid.v4() };
    case ROUTE_TRANSITION_EXPLORE_NEW_DETAIL:
      return { ...state, exploreSpaceIds: action.ids };
    default:
      return state;
  }
}
