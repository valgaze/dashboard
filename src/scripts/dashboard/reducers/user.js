import update from 'react-addons-update';

const initialState = {
  email: null,
  jwt: window.localStorage.jwt
}

export default function user(state=initialState, action) {
  switch(action.type) {
    case 'LOGIN_SUCCESS':
      return Object.assign({}, state, {
        jwt: action.jwt, 
        email: action.email
      });
    default:
      return state;
  }
}
