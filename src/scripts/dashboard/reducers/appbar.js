import update from 'react-addons-update';

const initialState = {
  sideNavOpen: false
}

export default function appbar(state=initialState, action) {
  switch(action.type) {
    case 'SIDE_NAV_TOGGLE':
      return Object.assign({}, state, {
        sideNavOpen: !state.sideNavOpen
      });
      break;
    case 'SIDE_NAV_CLOSE':
      return Object.assign({}, state, {
        sideNavOpen: false
      });
      break;
    default:
      return state;
  }
}
