import update from 'react-addons-update';
import moment from 'moment';

const initialState = {
  startDate: moment().subtract(7,'d'),
  endDate: Date.now(),
  totalVisitorCounts: []
}

export default function totalVisitors(state=initialState, action) {
  switch(action.type) {
    case 'TOTAL_VISITORS_SET_DATE_RANGE':
      return Object.assign({}, state, {
        startDate: action.dateRange[0],
        endDate: action.dateRange[1]
      });
      break;
    default:
      return state;
  }
}
