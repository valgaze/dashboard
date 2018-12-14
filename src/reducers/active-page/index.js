import { ROUTE_TRANSITION_LOGIN } from '../../actions/route-transition/login';
import { ROUTE_TRANSITION_EXPLORE_SPACE_LIST } from '../../actions/route-transition/explore-space-list';
import { ROUTE_TRANSITION_LIVE_SPACE_LIST } from '../../actions/route-transition/live-space-list';
import { ROUTE_TRANSITION_LIVE_SPACE_DETAIL } from '../../actions/route-transition/live-space-detail';
import { ROUTE_TRANSITION_ACCOUNT } from '../../actions/route-transition/account';
import { ROUTE_TRANSITION_DEV_WEBHOOK_LIST } from '../../actions/route-transition/dev-webhook-list';
import { ROUTE_TRANSITION_DEV_TOKEN_LIST } from '../../actions/route-transition/dev-token-list';
import { ROUTE_TRANSITION_ACCOUNT_REGISTER } from '../../actions/route-transition/account-register';
import { ROUTE_TRANSITION_ACCOUNT_FORGOT_PASSWORD } from '../../actions/route-transition/account-forgot-password';
import { ROUTE_TRANSITION_EXPLORE_SPACE_TRENDS } from '../../actions/route-transition/explore-space-trends';
import { ROUTE_TRANSITION_EXPLORE_SPACE_DAILY } from '../../actions/route-transition/explore-space-daily';
import { ROUTE_TRANSITION_EXPLORE_SPACE_DATA_EXPORT } from '../../actions/route-transition/explore-space-data-export';

import { ROUTE_TRANSITION_ACCOUNT_SETUP_OVERVIEW } from '../../actions/route-transition/account-setup-overview';
import { ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_LIST } from '../../actions/route-transition/account-setup-doorway-list';
import { ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_DETAIL } from '../../actions/route-transition/account-setup-doorway-detail';

import { ROUTE_TRANSITION_DASHBOARD_LIST } from '../../actions/route-transition/dashboard-list';
import { ROUTE_TRANSITION_DASHBOARD_DETAIL } from '../../actions/route-transition/dashboard-detail';
import { ROUTE_TRANSITION_EXPLORE_NEW_DETAIL } from '../../actions/route-transition/explore-new-detail';

const initialState = null;

export default function activePage(state=initialState, action) {
  switch (action.type) {
  case ROUTE_TRANSITION_LOGIN:
    return "LOGIN";

  case ROUTE_TRANSITION_LIVE_SPACE_LIST:
    return "LIVE_SPACE_LIST";
  case ROUTE_TRANSITION_LIVE_SPACE_DETAIL:
    return "LIVE_SPACE_DETAIL";
  case ROUTE_TRANSITION_EXPLORE_SPACE_LIST:
    return "EXPLORE_SPACE_LIST";
  case ROUTE_TRANSITION_EXPLORE_SPACE_TRENDS:
    return "EXPLORE_SPACE_TRENDS";
  case ROUTE_TRANSITION_EXPLORE_SPACE_DAILY:
    return "EXPLORE_SPACE_DAILY";
  case ROUTE_TRANSITION_EXPLORE_SPACE_DATA_EXPORT:
    return "EXPLORE_SPACE_DATA_EXPORT";

  case ROUTE_TRANSITION_DEV_TOKEN_LIST:
    return "DEV_TOKEN_LIST";
  case ROUTE_TRANSITION_DEV_WEBHOOK_LIST:
    return "DEV_WEBHOOK_LIST";

  case ROUTE_TRANSITION_ACCOUNT:
    return "ACCOUNT";
  case ROUTE_TRANSITION_ACCOUNT_REGISTER:
    return "ACCOUNT_REGISTRATION";
  case ROUTE_TRANSITION_ACCOUNT_FORGOT_PASSWORD:
    return "ACCOUNT_FORGOT_PASSWORD";

  // Onboarding pages
  case ROUTE_TRANSITION_ACCOUNT_SETUP_OVERVIEW:
    return "ACCOUNT_SETUP_OVERVIEW";
  case ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_LIST:
    return "ACCOUNT_SETUP_DOORWAY_LIST";
  case ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_DETAIL:
    return "ACCOUNT_SETUP_DOORWAY_DETAIL";

  case ROUTE_TRANSITION_DASHBOARD_LIST:
    return "DASHBOARD_LIST";
  case ROUTE_TRANSITION_DASHBOARD_DETAIL:
    return "DASHBOARD_DETAIL";

  case ROUTE_TRANSITION_EXPLORE_NEW_DETAIL:
    return "EXPLORE_NEW_DETAIL";

  default:
    return state;
  }
}
