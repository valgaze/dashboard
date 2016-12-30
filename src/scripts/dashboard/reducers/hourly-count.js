import update from 'react-addons-update';
import moment from 'moment';

const initialState = {
  date: moment().format()
}

export default function hourlyCount(state=initialState, action) {
  switch(action.type) {
    case 'HOURLY_COUNT_SET_DATE':
      return Object.assign({}, state, {
        date: action.date
      });
      break;
    default:
      return state;
  }
}
