import update from 'react-addons-update';
import moment from 'moment';

const initialState = {
  date: moment().toDate(),
  timestamps: [],
  counts: [],
  loading: false
}

function parseEventData(events){
  var timestamps = [];
  var counts = [];
  for (var i = 0; i < events.length; i++) {
    var dateObj = new Date(events[i].timestamp);
    var count = Math.max(0, events[i].spaces[0].count);
    timestamps.push(dateObj);
    counts.push(count);
  }
  return {timestamps: timestamps, counts: counts};
}

export default function eventCount(state=initialState, action) {
  switch(action.type) {
    case 'EVENT_COUNT_SET_DATE':
      return Object.assign({}, state, {
        date: action.date.toDate()
      });
    case 'EVENT_COUNT_BEGIN_REQUEST':
      return Object.assign({}, state, {
        timestamps: [],
        counts: [],
        loading: true
      });
    case 'EVENT_COUNT_SUCCESS_APPEND':
      var newEventCountData = parseEventData(action.rawEventData);
      return Object.assign({}, state, {
        timestamps: state.timestamps.concat(newEventCountData['timestamps']),
        counts: state.counts.concat(newEventCountData['counts']),
        loading: false
      });
    default:
      return state;
  }
}
