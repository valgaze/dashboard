import update from 'react-addons-update';

const SUCCESS = 'tokens/success';
const initialState = {
  results: []
}

export default function tokens(state=initialState, action) {
  switch(action.type) {
    case SUCCESS:
      let tokens = action.json;
      return Object.assign({}, state, {
        results: tokens
      });
    default:
      return state;
  }
}
