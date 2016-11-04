import { hashHistory } from 'react-router';

export function tokensGet(jwt) {
  return dispatch => {
    

    // for now, let's fake it til this endpoint exists!
    var json = {
      sandboxToken: "the_sandbox_token",
      liveToken: "the_live_token"
    }
    dispatch({type: 'TOKENS_SUCCESS', json: json})
    return;
    // the rest won't get executed...


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
      console.log('success' + json);
    }).catch(function(error) {
      dispatch({type: 'TOKENS_FAILURE', message: error.message});
    })
  }
}
