import { ROUTE_TRANSITION_LOGIN } from '../../actions/route-transition/login';
import { ROUTE_TRANSITION_TOKEN_LIST } from '../../actions/route-transition/token-list';
import { ROUTE_TRANSITION_SPACE_DETAIL } from '../../actions/route-transition/space-detail';
import { ROUTE_TRANSITION_SPACE_LIST } from '../../actions/route-transition/space-list';
import { ROUTE_TRANSITION_ENVIRONMENT } from '../../actions/route-transition/environment';
import { ROUTE_TRANSITION_ACCOUNT } from '../../actions/route-transition/account';
import { ROUTE_TRANSITION_WEBHOOK_LIST } from '../../actions/route-transition/webhook-list';
import { ROUTE_TRANSITION_ACCOUNT_REGISTER } from '../../actions/route-transition/account-register';

const initialState = null;

export default function activePage(state=initialState, action) {
  switch (action.type) {
  case ROUTE_TRANSITION_LOGIN:
    return "LOGIN";
  case ROUTE_TRANSITION_ENVIRONMENT:
    return "ENVIRONMENT";
  case ROUTE_TRANSITION_ACCOUNT:
    return "ACCOUNT"
  case ROUTE_TRANSITION_TOKEN_LIST:
    return "TOKEN_LIST";
  case ROUTE_TRANSITION_SPACE_LIST:
    return "SPACE_LIST";
  case ROUTE_TRANSITION_SPACE_DETAIL:
    return "SPACE_DETAIL";
  case ROUTE_TRANSITION_WEBHOOK_LIST:
    return "WEBHOOK_LIST";
  case ROUTE_TRANSITION_ACCOUNT_REGISTER:
    return "ACCOUNT_REGISTRATION"
  default:
    return state;
  }
}
