import update from 'react-addons-update';

import {DensityToaster} from 'dashboard/components/DensityToaster';


const initialState = {
  email: null,
  password: null,
  loading: false
}

export default function login(state=initialState, action) {
  switch(action.type) {
    case 'LOGIN_FIELD_UPDATE':
      return Object.assign({}, state, {[action.field]: action.value});
    case 'LOGIN_REQUEST':
      return Object.assign({}, state, {loading: true});
    case 'LOGIN_FAILURE':
      DensityToaster.show({ message: action.message, timeout: 8000, className: "pt-intent-danger" });
      return Object.assign({}, state, {loading: false});
    case 'LOGIN_SUCCESS':
      return initialState;
    default:
      return state;
  }
}
