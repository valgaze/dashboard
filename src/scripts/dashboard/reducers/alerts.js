import update from 'react-addons-update';
import dotProp from 'dot-prop-immutable';

const initialState = {
  results: [{
      id: -1,
      condition: null,
      channel: null,
      compareValue: null,
      space: null,
      enabled: true
    }]
}

function toggleEnabled(alertId, results){
  var newResults = [];
  for (var i = 0; i < results.length; i++) {
    if(results[i].id === alertId) {
      results[i].enabled = !results[i].enabled;
    }
    newResults.push(results[i]);
  }
  return newResults;
}

export default function alerts(state=initialState, action) {
  switch(action.type) {
    // case 'ALERTS_SUCCESS':
    //   return Object.assign({}, state, {
    //     results: action.json
    //   });
    //   break;
    case 'ALERTS_TOGGLE_ENABLED':
      var index = state.results.findIndex(e=>(e.id===action.alertId));
      var isEnabled = state.results[index].enabled
      var newState = dotProp.set(state, `results.${index}.enabled`, !isEnabled)
      return Object.assign({}, state, newState);
      break;
    case 'ALERTS_NEW_ALERT':
      let newAlert = [{
        id: -1,
        condition: null,
        channel: null,
        compareValue: null,
        space: null,
        enabled: false
      }];
      var newResults = newAlert.concat(state.results);
      return Object.assign({}, state, {
        results: newResults
      });
      break;
    default:
      return state;
  }
}
