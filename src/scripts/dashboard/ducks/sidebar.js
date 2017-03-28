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
    case CLOSE:
      return Object.assign({}, state, {
        sidebarOpen: false
      });
    default:
      return state;
  }
}

export const sidebarActions = {
  toggle() {
    return { type: TOGGLE };
  },
  close() {
    return { type: CLOSE };
  }  
}

