import update from 'react-addons-update';
import moment from 'moment';
import {} from 'moment-range';

const initialState = {
  startDate: moment().subtract(7,'d').startOf('day').format(),
  endDate: moment().format(),
  events: [],
  count: 0,
  pageNum: 1
}

export default function rawEvents(state=initialState, action) {
  switch(action.type) {
    case 'RAW_EVENTS_SET_DATE_RANGE':
      return Object.assign({}, state, {
        startDate: action.dateRange[0],
        endDate: action.dateRange[1]
      });
      break;
    case 'RAW_EVENTS_SUCCESS':
      return Object.assign({}, state, {
        events: action.json.results,
        count: action.json.count
      });
      break;
    default:
      return state;
  }
}
