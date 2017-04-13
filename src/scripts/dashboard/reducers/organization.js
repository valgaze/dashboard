import update from 'react-addons-update';

const initialState = {
  id: window.localStorage.orgId
}

export default function organization(state=initialState, action) {
  switch(action.type) {
    case 'USERS_ME_SUCCESS':
      let orgId = action.json.organization.id;
      return Object.assign({}, state, {
        id: orgId
      });
    default:
      return state;
  }
}
