import update from 'react-addons-update';

const initialState = {
  sandbox: null,
  live: null
}

export default function tokens(state=initialState, action) {
  switch(action.type) {
    case 'TOKENS_SUCCESS':
      return Object.assign({}, state, {
        sandbox: action.json.sandboxToken, 
        live: action.json.liveToken
      });
    default:
      return state;
  }
}
