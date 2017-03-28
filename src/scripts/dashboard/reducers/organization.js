import update from 'react-addons-update';

const initialState = {
  orgToken: null,
  id: window.localStorage.orgId
}

export default function organization(state=initialState, action) {
  switch(action.type) {
    case 'tokens/success':
      return Object.assign({}, state, {
        orgToken: action.json.tokens[0]
      });
    case 'USERS_ME_SUCCESS':
      let orgId = action.json.auth.organization.id;
      return Object.assign({}, state, {
        id: orgId
      });
    default:
      return state;
  }
}
