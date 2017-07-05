import { accounts } from '@density-int/client';
import { USER_PUSH } from './push';

export const USER_UPDATE = 'USER_UPDATE';

export default function userUpdate(firstName, lastName, email) {
  return (dispatch, getState) => {
    dispatch({ type: USER_UPDATE, firstName, lastName, email });

    // Set new user details.
    return accounts.users.update({
      first_name: firstName,
      last_name: lastName,
      email,
    }).then(() => {
      // Report success.
      dispatch({ type: USER_PUSH, item: {firstName, lastName, email} });
    });
  };
}
