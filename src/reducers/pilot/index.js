import moment from 'moment';

import { PILOT_SET } from '../../actions/pilot/set';
import { PILOT_UPDATE } from '../../actions/pilot/update';

const initialState = {
  updated: new Date(),
  doorways: []
};

function doorwaysWithUpdatedCountAndHourly(doorways, doorwayId, totalEvents, sinceDate) {
  for (var i = 0; i < doorways.length; i++) {
    if (doorwayId === doorways[i]['id']) {
      var hourlyDifference = moment().diff(moment(sinceDate), 'hours');
      var workWeekDifference = parseInt(hourlyDifference, 10)*(5/7); // assuming you work M-F
      var workDayDifference = parseInt(workWeekDifference, 10)*(1/2); // assuming you work for 12 hours
      doorways[i]['humansPerHour'] = Math.round(totalEvents/workDayDifference);
      doorways[i]['totalHumansSeen'] = totalEvents;
    }
  }
  return doorways;
}

export default function pilot(state=initialState, action) {
  switch (action.type) {
  case PILOT_SET:
    return action.data;
  case PILOT_UPDATE:
    return {
      ...state, 
      updated: new Date(), 
      doorways: doorwaysWithUpdatedCountAndHourly(state.doorways, action.doorwayId, action.totalEvents, action.sinceDate)}
  default:
    return state;
  }
}