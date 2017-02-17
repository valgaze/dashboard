import update from 'react-addons-update';

const initialState = {
  services: null,
  slackEnabled: null,
  slackLoading: false,
  slackChannels: []
}

function checkForSlackService(json) {
  for (var i = 0; i < json.length; i++) {
    if (json[i]['name']==="slack") {
      return true
      break;
    }
  }
  return false;
}

export default function integrations(state=initialState, action) {
  switch(action.type) {
    case 'SERVICES_SUCCESS':
      return Object.assign({}, state, {
        services: action.json,
        slackEnabled: checkForSlackService(action.json)
      });
    case 'SERVICES_SLACK_CODE_REQUEST':
      return Object.assign({}, state, {
        slackLoading: true
      });
    case 'SERVICES_SLACK_CODE_SUCCESS':
      return Object.assign({}, state, {
        slackLoading: false
      });
    case 'SERVICES_SLACK_CODE_FAIL':
      return Object.assign({}, state, {
        slackLoading: false
      });
    case 'SERVICES_SLACK_CHANNELS_SUCCESS':
      return Object.assign({}, state, {
        slackChannels: action.json,
        slackEnabled: true
      });
    default:
      return state;
  }
}
