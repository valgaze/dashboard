import update from 'react-addons-update';
import {API_URL} from 'dashboard/constants';

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

export const doorwayActions = {
  list() {
    return (dispatch, getState) => {
      let state = getState();
      fetch(`${API_URL}/doorways/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.user.token}`
        },
      })
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else if (response.status == 403) {
          return response.json().then(({detail}) => {
            throw new Error(detail);
          });
        } else {
          throw new Error(response.statusText);
        }
      }).then(function(json) {
        dispatch({type: SUCCESS, json: json});
      }).catch(function(error) {
        console.log(error.message);
      })
    }
  }
}