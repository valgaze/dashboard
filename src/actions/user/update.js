import { accounts } from '@density-int/client';
import { USER_PUSH } from './push';

export const USER_UPDATE = 'USER_UPDATE';

export default function userUpdate(fullName, nickname, email) {
  return (dispatch, getState) => {
    dispatch({ type: USER_UPDATE, fullName, nickname, email });

    // Set new user details.
    return accounts.users.update({
      full_name: fullName,
      nickname: nickname,
      email,
    }).then(() => {
      // Report success.
      dispatch({ type: USER_PUSH, item: {fullName, nickname, email} });
    });
  };
}
