import { ROUTE_TRANSITION_ACCOUNT_FORGOT_PASSWORD } from '../../actions/route-transition/account-forgot-password';

const initialState = null;
export default function accountForgotPassword(state=initialState, action) {
  switch (action.type) {
  case ROUTE_TRANSITION_ACCOUNT_FORGOT_PASSWORD:
    return action.body;
  default:
    return state;
  }
}
