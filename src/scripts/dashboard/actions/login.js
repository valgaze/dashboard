import {hashHistory} from 'react-router'; 

import {ACCOUNTS_URL} from 'dashboard/constants';
import {usersMe} from 'dashboard/actions/users';

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

    fetch(`${ACCOUNTS_URL}/login/`, {
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
      dispatch({type: 'LOGIN_SUCCESS', token: json, email: email});
      dispatch({type: 'SAVE_TOKEN_TO_LOCAL_STORAGE', token: json});
      dispatch(usersMe());
      hashHistory.push('/spaces');
    }).catch(function(error) {
      dispatch({type: 'LOGIN_FAILURE', message: error.message});
    })
  }
}
