import update from 'react-addons-update';
import dotProp from 'dot-prop-immutable';

const initialState = {
  results: []
}

function orderById(results) {
  return results.sort(function(a, b) {
    return b.id - a.id;
  });
}

export default function alerts(state=initialState, action) {
  switch(action.type) {
    case 'ALERTS_SUCCESS':
      return Object.assign({}, state, {
        results: orderById(action.json)
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
        mode: "new",
        id: 9999999999,
        condition: null,
        channel: "",
        compare_value: 0,
        space_id: "",
        enabled: true
      }];
      var newResults = newAlert.concat(state.results);
      return Object.assign({}, state, {
        results: orderById(newResults)
      });
    case 'ALERTS_EDIT_ALERT':
      var index = state.results.findIndex(e=>(e.id===action.alertId));
      var newState = dotProp.set(state, `results.${index}.mode`, "edit")
      return Object.assign({}, state, newState);
    case 'ALERTS_CANCEL_ALERT':
      var index = state.results.findIndex(e=>(e.id===action.alertId));
      if (state.results[index].mode == "new") {
        var newState = dotProp.delete(state, `results.${index}`)
      } else {
        var newState = dotProp.set(state, `results.${index}.mode`, null)
      }
      return Object.assign({}, state, newState);
    case 'ALERTS_UPDATE_FORM_FIELD':
      var index = state.results.findIndex(e=>(e.id===action.alertId));
      var newState = dotProp.set(state, `results.${index}.${action.field}`, action.value);
      return Object.assign({}, state, newState);
    case 'ALERTS_DELETE_SUCCESS':
      var index = state.results.findIndex(e=>(e.id===action.alertId));
      var newState = dotProp.delete(state, `results.${index}`)
      return Object.assign({}, state, newState);
    default:
      return state;
  }
}
