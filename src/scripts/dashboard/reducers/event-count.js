import update from 'react-addons-update';
import moment from 'moment';

const initialState = {
  date: moment().toDate(),
  timestamps: [],
  counts: []
}

function parseEventData(events){
  var eventsReversed = events.reverse();
  var timestamps = [];
  var counts = [];
  for (var i = 0; i < eventsReversed.length; i++) {
    var dateObj = new Date(eventsReversed[i].timestamp);
    var count = Math.max(0, eventsReversed[i].spaces[0].count);
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
    case 'EVENT_COUNT_SUCCESS':
      var eventData = parseEventData(action.json.results);
      console.log(eventData);
      return Object.assign({}, state, eventData);
    default:
      return state;
  }
}
