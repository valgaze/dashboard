import { accounts } from '@density-int/client';
import sessionTokenSet from '../session-token/set';

export const USER_RESET_PASSWORD = 'USER_RESET_PASSWORD';
export const USER_RESET_PASSWORD_SUCCESS = 'USER_RESET_PASSWORD_SUCCESS';

export default function userResetPassword(current, password) {
  return (dispatch, getState) => {
    dispatch({ type: USER_RESET_PASSWORD, password });

    // Set the new password.
    return accounts.users.password({
      old_password: current,
      new_password: password,
      confirm_password: password,
    }).then(() => {
      // Fetch a new access token with new password.
      return accounts.users.login({email: getState().user.email, password})
    }).then(token => {
      dispatch(sessionTokenSet(token));

      // Report success.
      dispatch({ type: USER_RESET_PASSWORD_SUCCESS });
    });
  };
}
