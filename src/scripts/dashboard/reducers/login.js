import update from 'react-addons-update';

const initialState = {
  email: "",
  password: "",
  statusText: ""
}

export default function login(state=initialState, action) {
  switch(action.type) {
    case 'LOGIN_FIELD_UPDATE':
      return Object.assign({}, state, {[action.field]: action.value});
    case 'LOGIN_REQUEST':
      return Object.assign({}, state, {statusText: "Logging in..."});
    case 'LOGIN_FAILURE':
      return Object.assign({}, state, {statusText: action.message });
    case 'LOGIN_SUCCESS':
      return Object.assign({}, state, {statusText: "Success!" });
    default:
      return state;
  }
}
