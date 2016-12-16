import update from 'react-addons-update';

const initialState = {
  count: null,
  results: null,
  currentObj: {},
  editingCurrentCount: false,
  tempCount: null,
  editingSpaceDetails: false,
  tempName: ""
}

export default function spaces(state=initialState, action) {
  switch(action.type) {
    case 'SPACES_INDEX_SUCCESS':
      return Object.assign({}, state, {
        count: action.json.count,
        results: action.json.results
      });
      break;
    case 'SPACES_READ_REQUEST':
      return initialState;
      break;
    case 'SPACES_READ_SUCCESS':
      return Object.assign({}, state, {
        currentObj: action.json,
        tempName: action.json.name
      });
      break;
    case 'SPACES_TOGGLE_EDIT_DETAILS':
      return Object.assign({}, state, {
        editingSpaceDetails: !action.editingSpaceDetails,
        tempName: state.currentObj.name
      });
      break;
    case 'SPACES_FORM_FIELD_UPDATE':
      return Object.assign({}, state, {
        [action.field]: action.value
      });
      break;
    case 'SPACES_UPDATE_REQUEST':
      return Object.assign({}, state, {
      });
      break;
    case 'SPACES_UPDATE_SUCCESS':
      var newCurrentObj = state.currentObj;
      newCurrentObj.name = action.json.name;
      return Object.assign({}, state, {
        currentObj: newCurrentObj,
        editingSpaceDetails: false,
        tempName: null
      });
      break;
    case 'SPACES_UPDATE_COUNT_REQUEST':
      return Object.assign({}, state, {
      });
      break;
    case 'SPACES_UPDATE_COUNT_SUCCESS':
      var newCurrentObj = state.currentObj;
      newCurrentObj.current_count = action.json.count;
      return Object.assign({}, state, {
        currentObj: newCurrentObj,
        editingCurrentCount: false,
        tempCount: null
      });
      break;
    case 'SPACES_TOGGLE_EDIT_COUNT':
      return Object.assign({}, state, {
        editingCurrentCount: !action.editingCurrentCount,
        tempCount: state.currentObj.current_count
      });
      break;
    case 'SPACES_NEW_TEMP_COUNT':
      var newTempCount = state.tempCount+action.countChange;
      return Object.assign({}, state, {
        tempCount: newTempCount
      });
      break;
    default:
      return state;
  }
}
