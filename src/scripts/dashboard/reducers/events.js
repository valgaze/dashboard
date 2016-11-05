import update from 'react-addons-update';

const initialState = {
  count: null,
  events: null
}

export default function events(state=initialState, action) {
  switch(action.type) {
    case 'EVENTS_SUCCESS':
      return Object.assign({}, state, {
        count: action.json.count,
        events: action.json.results
      });
      break;
    default:
      return state;
  }
}
