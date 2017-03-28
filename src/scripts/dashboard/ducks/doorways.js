import update from 'react-addons-update';
import api from 'dashboard/helpers/api';


const SUCCESS = 'doorways/success';
const initialState = {
  count: null,
  results: null
}

export default function doorways(state=initialState, action) {
  switch(action.type) {
    case SUCCESS:
      return Object.assign({}, state, {
        count: action.json.count,
        results: action.json.results
      });
      break;
    default:
      return state;
  }
}

export const doorway = {
  list() {
    return (dispatch, getState) => {
      let state = getState();
      return api.list(state, '/doorways').then(function(json){
        dispatch({type: SUCCESS, json: json});
      });
    }
  }
}