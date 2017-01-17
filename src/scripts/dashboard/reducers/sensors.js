import update from 'react-addons-update';

const initialState = {
  count: null,
  results: null
}

export default function sensors(state=initialState, action) {
  switch(action.type) {
    case 'SENSORS_INDEX_SUCCESS':
      return Object.assign({}, state, {
        count: action.json.count,
        results: action.json.results
      });
      break;
    default:
      return state;
  }
}
