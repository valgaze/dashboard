import update from 'react-addons-update';

const initialState = {
  count: null,
  spaces: null
}

export default function spaces(state=initialState, action) {
  switch(action.type) {
    case 'SPACES_SUCCESS':
      // return Object.assign({}, state, {
      //   sandbox: action.json.sandboxToken, 
      //   live: action.json.liveToken
      // });
      console.log("reducer");
      console.log(action);
      break;
    default:
      return state;
  }
}
