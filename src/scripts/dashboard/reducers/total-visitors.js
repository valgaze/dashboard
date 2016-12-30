import update from 'react-addons-update';
import moment from 'moment';
import {} from 'moment-range';

const initialState = {
  startDate: moment().subtract(7,'d').startOf('day').toDate(),
  endDate: moment().toDate(),
  dates: moment.range(moment().subtract(7, 'd'), Date.now()).toArray('days').map(date => date.format('YYYY-MM-DD')),
  totalVisitorCounts: [0,0,0,0,0,0,0]
}

export default function totalVisitors(state=initialState, action) {
  switch(action.type) {
    case 'TOTAL_VISITORS_SET_DATE_RANGE':
      var dates = moment.range(action.dateRange[0], action.dateRange[1]).toArray('days').map(date => date.format('YYYY-MM-DD'));
      return Object.assign({}, state, {
        startDate: action.dateRange[0].toDate(),
        endDate: action.dateRange[1].toDate(),
        dates: dates,
        totalVisitorCounts: Array.apply(null, {length: dates.length}).map(()=>0)
      });
      break;
    case 'TOTAL_VISITORS_SET_VISITOR_COUNTS':
      return Object.assign({}, state, {
        totalVisitorCounts: action.newCounts
      });
    default:
      return state;
  }
}
