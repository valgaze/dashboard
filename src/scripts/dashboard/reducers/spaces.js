import update from 'react-addons-update';

const initialState = {
  count: null,
  results: null,
  currentObj: {},
  editingCurrentCount: false,
  tempCount: null
}

export default function spaces(state=initialState, action) {
  switch(action.type) {
    case 'SPACES_INDEX_SUCCESS':
      return Object.assign({}, state, {
        count: action.json.count,
        results: action.json.results
      });
      break;
    case 'SPACES_UPDATE_COUNT_REQUEST':
      return Object.assign({}, state, {
      });
      break;
    case 'SPACES_UPDATE_COUNT_SUCCESS':
      return Object.assign({}, state, {
        currentObj: action.newCurrentObj,
        editingCurrentCount: false,
        tempCount: null
      });
      break;
    case 'SPACES_READ_REQUEST':
      return Object.assign({}, state, {
        currentObj: {},
        editingCurrentCount: false,
        tempCount: null
      });
      break;
    case 'SPACES_READ_SUCCESS':
      return Object.assign({}, state, {
        currentObj: action.json
      });
      break;
    case 'SPACES_TOGGLE_EDIT_COUNT':
      return Object.assign({}, state, {
        editingCurrentCount: !action.editingCurrentCount,
        tempCount: state.currentObj.current_count
      });
      break;
    case 'SPACES_NEW_TEMP_COUNT':
      return Object.assign({}, state, {
        tempCount: action.newTempCount
      });
      break;
    default:
      return state;
  }
}
