import {ACCOUNTS_URL} from 'dashboard/constants';

export function usersMe() {
  return (dispatch, getState) => {
    let state = getState();
    return fetch(`${ACCOUNTS_URL}/users/me/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.user.token}`
      },
    })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else if (response.status == 403) {
        return response.json().then(({detail}) => {
          throw new Error(detail);
        });
      } else {
        throw new Error(response.statusText);
      }
    }).then(function(json) {
      dispatch({type: 'SAVE_ORG_ID_TO_LOCAL_STORAGE', json: json});
      dispatch({type: 'USERS_ME_SUCCESS', json: json});
    })
  }
}