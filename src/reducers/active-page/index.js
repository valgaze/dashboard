import { ROUTE_TRANSITION_LOGIN } from '../../actions/route-transition/login';
import { ROUTE_TRANSITION_TOKEN_LIST } from '../../actions/route-transition/token-list';
import { ROUTE_TRANSITION_SPACE_DETAIL } from '../../actions/route-transition/space-detail';
import { ROUTE_TRANSITION_SPACE_LIST } from '../../actions/route-transition/space-list';

const initialState = null;

export default function activePage(state=initialState, action) {
  switch (action.type) {
  case ROUTE_TRANSITION_LOGIN:
    return "LOGIN";
  case ROUTE_TRANSITION_TOKEN_LIST:
    return "TOKEN_LIST";
  case ROUTE_TRANSITION_SPACE_LIST:
    return "SPACE_LIST";
  case ROUTE_TRANSITION_SPACE_DETAIL:
    return "SPACE_DETAIL";
  default:
    return state;
  }
}
