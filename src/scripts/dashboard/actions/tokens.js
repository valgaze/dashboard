import {ACCOUNTS_URL} from 'dashboard/constants';

export function tokensIndex() {
  return (dispatch, getState) => {
    let state = getState();
    fetch(`${ACCOUNTS_URL}/org_tokens/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.user.jwt}`
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
      dispatch({type: 'TOKENS_SUCCESS', json: json});
    }).catch(function(error) {
      dispatch({type: 'TOKENS_FAILURE', message: error.message});
    })
  }
}
