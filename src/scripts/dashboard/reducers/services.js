import update from 'react-addons-update';

const initialState = {
  results: null,
  slackToken: null
}

function parseSlackToken(json) {
  for (var i = 0; i < json.length; i++) {
    if (json[i]['name']==="slack") {
      return json[i]['token'];
      break;
    }
  }
  return null;
}

export default function services(state=initialState, action) {
  switch(action.type) {
    case 'SERVICES_SUCCESS':
      return Object.assign({}, state, {
        results: action.json,
        slackToken: parseSlackToken(action.json)
      });
    default:
      return state;
  }
}
