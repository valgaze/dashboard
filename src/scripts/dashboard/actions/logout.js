import {hashHistory} from 'react-router';

export function logoutUser() {
  return dispatch => {
    hashHistory.push('/login');
    dispatch({type: 'DELETE_JWT_FROM_LOCAL_STORAGE'});
    dispatch({type: 'LOGOUT_USER'});
  }
}

