export function tokensGet(jwt) {
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
      dispatch({type: 'TOKENS_SUCCESS', json: json});
    }).catch(function(error) {
      dispatch({type: 'TOKENS_FAILURE', message: error.message});
    })
  }
}
