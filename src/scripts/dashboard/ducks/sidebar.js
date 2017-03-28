import update from 'react-addons-update';

const TOGGLE = 'sidebar/toggle';
const CLOSE = 'sidebar/close';
const initialState = {
  sidebarOpen: false
}

export default function sidebar(state=initialState, action) {
  switch(action.type) {
    case TOGGLE:
      return Object.assign({}, state, {
        sidebarOpen: !state.sidebarOpen
      });
    case TOGGLE:
      return Object.assign({}, state, {
        sidebarOpen: false
      });
    default:
      return state;
  }
}

export function toggleSidebar() {
  return { type: TOGGLE };
}

export function closeSidebar() {
  return { type: CLOSE };
}
