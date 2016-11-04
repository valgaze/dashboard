import { hashHistory } from 'react-router';

export function tokensGet(jwt) {
  console.log("fetching tokens");
  return dispatch => {
    fetch('https://clerk.density.io/org_tokens/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
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
      console.log(json);
    }).catch(function(error) {
      dispatch({type: 'LOGIN_FAILURE', message: error.message});
    })
  }
}
