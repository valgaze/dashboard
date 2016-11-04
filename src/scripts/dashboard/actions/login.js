import { hashHistory } from 'react-router';

export function loginFieldUpdate(field, value) {
  return {
    type: 'LOGIN_FIELD_UPDATE',
    field: field,
    value: value
  }
};

export function loginSubmit(email, password) {
  return dispatch => {
    dispatch({type: "LOGIN_REQUEST"});

    var loginParams = {
      email: email,
      password: password
    }

    fetch('https://clerk.density.io/tokens/', {
      method: 'POST',
      body: JSON.stringify(loginParams),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
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
      dispatch({type: 'LOGIN_SUCCESS'});
      dispatch({type: 'CHANGE_JWT', jwt: json});
      hashHistory.push('/tokens');
    }).catch(function(error) {
      dispatch({type: 'LOGIN_FAILURE', message: error.message});
    })
  }
}
