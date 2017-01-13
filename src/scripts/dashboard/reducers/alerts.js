import update from 'react-addons-update';
import dotProp from 'dot-prop-immutable';

const initialState = {
  results: [{
      state: "new",
      id: null,
      condition: null,
      channel: null,
      compareValue: null,
      space: null,
      enabled: false
    }]
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
      var isEnabled = state.results[index].enabled;
      var newState = dotProp.set(state, `results.${index}.enabled`, !isEnabled);
      return Object.assign({}, state, newState);
      break;
    case 'ALERTS_NEW_ALERT':
      let newAlert = [{
        state: "new",
        id: null,
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
