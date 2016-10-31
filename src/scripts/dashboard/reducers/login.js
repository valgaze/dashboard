import update from 'react-addons-update';

const initialState = [];

export default function activity(state=initialState, action) {
  switch(action.type) {
    case 'LOGIN_PRESSED':
      console.log(action);
      return state;
    default:
      console.log(action);
      return state;
  }
}
