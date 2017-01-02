import update from 'react-addons-update';
import moment from 'moment';

const initialState = {
  date: moment().toDate(),
  timestamps: [],
  counts: []
}

export default function eventCount(state=initialState, action) {
  switch(action.type) {
    case 'EVENT_COUNT_SET_DATE':
      return Object.assign({}, state, {
        date: action.date.toDate()
      });
      break;
    default:
      return state;
  }
}
