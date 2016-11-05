import update from 'react-addons-update';

const initialState = {
  count: null,
  spaces: null
}

export default function spaces(state=initialState, action) {
  switch(action.type) {
    case 'SPACES_SUCCESS':
      return Object.assign({}, state, {
        count: action.json.count,
        spaces: action.json.results
      });
      break;
    default:
      return state;
  }
}
