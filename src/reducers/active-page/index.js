import { ROUTE_TRANSITION_LOGIN } from '../../actions/route-transition/login';
import { ROUTE_TRANSITION_VISUALIZATION_SPACE_DETAIL } from '../../actions/route-transition/visualization-space-detail';
import { ROUTE_TRANSITION_VISUALIZATION_SPACE_LIST } from '../../actions/route-transition/visualization-space-list';
import { ROUTE_TRANSITION_ENVIRONMENT_SPACE } from '../../actions/route-transition/environment-space';
import { ROUTE_TRANSITION_ACCOUNT } from '../../actions/route-transition/account';
import { ROUTE_TRANSITION_DEV_WEBHOOK_LIST } from '../../actions/route-transition/dev-webhook-list';
import { ROUTE_TRANSITION_DEV_TOKEN_LIST } from '../../actions/route-transition/dev-token-list';
import { ROUTE_TRANSITION_ACCOUNT_REGISTER } from '../../actions/route-transition/account-register';

const initialState = null;

export default function activePage(state=initialState, action) {
  switch (action.type) {
  case ROUTE_TRANSITION_LOGIN:
    return "LOGIN";
  case ROUTE_TRANSITION_ENVIRONMENT_SPACE:
    return "ENVIRONMENT_SPACE";

  case ROUTE_TRANSITION_VISUALIZATION_SPACE_LIST:
    return "VISUALIZATION_SPACE_LIST";
  case ROUTE_TRANSITION_VISUALIZATION_SPACE_DETAIL:
    return "VISUALIZATION_SPACE_DETAIL";

  case ROUTE_TRANSITION_DEV_TOKEN_LIST:
    return "DEV_TOKEN_LIST";
  case ROUTE_TRANSITION_DEV_WEBHOOK_LIST:
    return "DEV_WEBHOOK_LIST";

  case ROUTE_TRANSITION_ACCOUNT:
    return "ACCOUNT"
  case ROUTE_TRANSITION_ACCOUNT_REGISTER:
    return "ACCOUNT_REGISTRATION"
  default:
    return state;
  }
}
