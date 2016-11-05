import update from 'react-addons-update';

const initialState = {
  sandboxToken: null,
  liveToken: null
}

export default function organization(state=initialState, action) {
  switch(action.type) {
    case 'TOKENS_SUCCESS':
      return Object.assign({}, state, {
        sandboxToken: action.json.sandboxToken, 
        liveToken: action.json.liveToken
      });
    default:
      return state;
  }
}
