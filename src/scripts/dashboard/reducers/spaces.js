import update from 'react-addons-update';

const initialState = {
  count: null,
  results: null,
  currentObj: {}
}

export default function spaces(state=initialState, action) {
  switch(action.type) {
    case 'SPACES_INDEX_SUCCESS':
      return Object.assign({}, state, {
        count: action.json.count,
        results: action.json.results
      });
      break;
    case 'SPACES_READ_REQUEST':
      return Object.assign({}, state, {
        currentObj: {}
      });
      break;
    case 'SPACES_READ_SUCCESS':
      return Object.assign({}, state, {
        currentObj: action.json
      });
      break;
    default:
      return state;
  }
}
