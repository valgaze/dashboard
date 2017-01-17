import update from 'react-addons-update';

const initialState = {
  count: null,
  results: null
}

export default function events(state=initialState, action) {
  switch(action.type) {
    case 'EVENTS_SUCCESS':
      return Object.assign({}, state, {
        count: action.json.count,
        results: action.json.results
      });
    default:
      return state;
  }
}
