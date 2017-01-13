import update from 'react-addons-update';
import dotProp from 'dot-prop-immutable';

const initialState = {
  results: []
}

export default function alerts(state=initialState, action) {
  switch(action.type) {
    case 'ALERTS_SUCCESS':
      return Object.assign({}, state, {
        results: action.json
      });
      break;
    case 'ALERTS_TOGGLE_ENABLED':
      var index = state.results.findIndex(e=>(e.id===action.alertId));
      var isEnabled = state.results[index].enabled;
      var newState = dotProp.set(state, `results.${index}.enabled`, !isEnabled);
      return Object.assign({}, state, newState);
    case 'ALERTS_NEW_ALERT':
      var index = state.results.findIndex(e=>(e.id===null));
      if (index>-1) {
        return state;
      }
      let newAlert = [{
        state: "new",
        id: null,
        condition: null,
        channel: null,
        compareValue: 0,
        space_id: null,
        enabled: false
      }];
      var newResults = newAlert.concat(state.results);
      return Object.assign({}, state, {
        results: newResults
      });
    case 'ALERTS_CANCEL_NEW_ALERT':
      var index = state.results.findIndex(e=>(e.id===action.alertId));
      var newState = dotProp.delete(state, `results.${index}`)
      return Object.assign({}, state, newState);
    case 'ALERTS_UPDATE_FORM_FIELD':
      var index = state.results.findIndex(e=>(e.id===action.alertId));
      var newState = dotProp.set(state, `results.${index}.${action.field}`, action.value);
      return Object.assign({}, state, newState);
    default:
      return state;
  }
}
