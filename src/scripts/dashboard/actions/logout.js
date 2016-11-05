import {push} from 'react-router-redux';


export function logoutUser() {
  return dispatch => {
    dispatch(push('/login'));
    dispatch({type: 'DELETE_JWT_FROM_LOCAL_STORAGE'});
    dispatch({type: 'LOGOUT_USER'});
  }
}

