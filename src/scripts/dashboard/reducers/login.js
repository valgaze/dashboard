import update from 'react-addons-update';

const initialState = {
  email: "",
  password: "",
  statusText: ""
}

export default function login(state=initialState, action) {
  switch(action.type) {
    case 'LOGIN_UPDATE':
      return Object.assign({}, state, {[action.field]: action.value});
    case 'LOGIN_REQUEST':
      return Object.assign({}, state, {['statusText']: "Logging you in..."});
    case 'LOGIN_FAILURE':
      return Object.assign({}, state, {['statusText']: "Sorry, we couldn't log you in."});
    default:
      console.log("Initial State");
      return state;
  }
}
