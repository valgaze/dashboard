import update from 'react-addons-update';

const initialState = {
  count: null,
  doorways: null
}

export default function doorways(state=initialState, action) {
  switch(action.type) {
    case 'DOORWAYS_SUCCESS':
      return Object.assign({}, state, {
        count: action.json.count,
        doorways: action.json.results
      });
      break;
    default:
      return state;
  }
}
