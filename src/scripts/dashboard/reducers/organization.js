import update from 'react-addons-update';

const initialState = {
  orgToken: null
}

export default function organization(state=initialState, action) {
  switch(action.type) {
    case 'TOKENS_SUCCESS':
      return Object.assign({}, state, {
        orgToken: action.json.tokens[0]
      });
    default:
      return state;
  }
}
