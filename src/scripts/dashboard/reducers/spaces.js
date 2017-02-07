import update from 'react-addons-update';
import dotProp from 'dot-prop-immutable';

const initialState = {
  count: null,
  results: null,
  currentObj: {},
  editingCurrentCount: false,
  tempCount: null,
  editingSpaceDetails: false,
  tempName: "",
  tempDailyReset: ""
}

export default function spaces(state=initialState, action) {
  switch(action.type) {
    case 'SPACES_INDEX_SUCCESS':
      return Object.assign({}, state, {
        count: action.json.count,
        results: action.json.results
      });
    case 'SPACES_READ_REQUEST':
      if(state.currentObj.id != action.spaceId) {
        return Object.assign({}, state, {
          currentObj: {},
          editingCurrentCount: false,
          editingSpaceDetails: false,
          tempName: "",
          tempDailyReset: "",
          tempCount: null
        });   
      } else {
        return state;
      }
      break;    
    case 'SPACES_READ_SUCCESS':
      return Object.assign({}, state, {
        currentObj: action.json
      });
    case 'SPACES_TOGGLE_EDIT_DETAILS':
      return Object.assign({}, state, {
        editingSpaceDetails: !action.editingSpaceDetails,
        tempName: state.currentObj.name,
        tempDailyReset: state.currentObj.daily_reset
      });
    case 'SPACES_FORM_FIELD_UPDATE':
      return Object.assign({}, state, {
        [action.field]: action.value
      });
    case 'SPACES_UPDATE_SUCCESS':
      var newCurrentObj = state.currentObj;
      newCurrentObj.name = action.json.name;
      return Object.assign({}, state, {
        currentObj: newCurrentObj,
        editingSpaceDetails: false
      });
    case 'SPACES_UPDATE_COUNT_REQUEST':
      return Object.assign({}, state, {
      });
    case 'SPACES_UPDATE_COUNT_SUCCESS':
      var newCurrentObj = state.currentObj;
      newCurrentObj.current_count = action.json.count;
      return Object.assign({}, state, {
        currentObj: newCurrentObj,
        editingCurrentCount: false,
        tempCount: null
      });
    case 'SPACES_TOGGLE_EDIT_COUNT':
      return Object.assign({}, state, {
        editingCurrentCount: !action.editingCurrentCount,
        tempCount: state.currentObj.current_count
      });
    case 'SPACES_NEW_TEMP_COUNT':
      var newTempCount = state.tempCount+action.countChange;
      return Object.assign({}, state, {
        tempCount: newTempCount
      });
    case 'SPACES_ZERO_COUNT':
      return Object.assign({}, state, {
        tempCount: 0
      });
    case 'SPACES_SIMULATE_EVENT_SUCCESS':
      var direction = action.direction;
      var currentCount = state.currentObj.current_count;
      var newCount = currentCount+direction;
      var newState = dotProp.set(state, `currentObj.current_count`, newCount);
      return Object.assign({}, state, newState);
    default:
      return state;
  }
}
