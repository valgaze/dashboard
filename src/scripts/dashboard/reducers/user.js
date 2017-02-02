import update from 'react-addons-update';

const initialState = {
  email: null,
  token: window.localStorage.token
}

export default function user(state=initialState, action) {
  switch(action.type) {
    case 'LOGIN_SUCCESS':
      return Object.assign({}, state, {
        token: action.token, 
        email: action.email
      });
    default:
      return state;
  }
}
