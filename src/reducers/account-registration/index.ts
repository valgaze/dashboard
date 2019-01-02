import { ROUTE_TRANSITION_ACCOUNT_REGISTER } from '../../actions/route-transition/account-register';

const initialState = null;
export default function accountRegistration(state=initialState, action) {
  switch (action.type) {

  // When switching to the account registration page, store the data in the url into the state.
  // Whenever the url changes, this action is fired.
  case ROUTE_TRANSITION_ACCOUNT_REGISTER:
    return action.body;
  default:
    return state;
  }
}
