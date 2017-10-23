import moment from 'moment';

import { PILOT_UPDATE } from '../../actions/pilot/update';

const initialState = {
  spaceId: "spc_275872166560399620",
  updated: new Date(),
  doorways: [
    {
      id: "drw_100249459190923532",
      name: "Elevator A Installation",
      uptime: "99%",
      accuracy: "97%",
      humansPerHour: 0,
      totalHumansSeen: 0,
      rawVideo: 'https://s3.amazonaws.com/dashboard.density.io/vids/raw_elevator_a_compressed.mp4',
      algoVideo: 'https://s3.amazonaws.com/dashboard.density.io/vids/algo_elevator_a_compressed.mp4'
    },
    {
      id: "drw_9414389350269184",
      name: "Elevator B Installation",
      uptime: "99%",
      accuracy: "95%",
      humansPerHour: 0,
      totalHumansSeen: 0,
      rawVideo: 'https://s3.amazonaws.com/dashboard.density.io/vids/algo_elevator_a_compressed.mp4',
      algoVideo: 'https://s3.amazonaws.com/dashboard.density.io/vids/algo_elevator_a_compressed.mp4'
    },
    {
      id: "drw_102668554003808568",
      name: "Glass Entry Installation",
      uptime: "99%",
      accuracy: "95%",
      humansPerHour: 0,
      totalHumansSeen: 0,
      rawVideo: 'https://s3.amazonaws.com/dashboard.density.io/vids/algo_elevator_a_compressed.mp4',
      algoVideo: 'https://s3.amazonaws.com/dashboard.density.io/vids/algo_elevator_a_compressed.mp4'
    },
    {
      id: "drw_204050029856424200",
      name: "Stairwell A Installation",
      uptime: "99%",
      accuracy: "95%",
      humansPerHour: 0,
      totalHumansSeen: 0,
      rawVideo: 'https://s3.amazonaws.com/dashboard.density.io/vids/algo_elevator_a_compressed.mp4',
      algoVideo: 'https://s3.amazonaws.com/dashboard.density.io/vids/algo_elevator_a_compressed.mp4'
    },
    {
      id: "drw_107491478137209132",
      name: "Stairwell B Installation",
      uptime: "99%",
      accuracy: "95%",
      humansPerHour: 0,
      totalHumansSeen: 0,
      rawVideo: 'https://s3.amazonaws.com/dashboard.density.io/vids/algo_elevator_a_compressed.mp4',
      algoVideo: 'https://s3.amazonaws.com/dashboard.density.io/vids/algo_elevator_a_compressed.mp4'
    }
  ]
};

function doorwaysWithUpdatedCountAndHourly(doorways, doorwayId, totalEvents, sinceDate) {
  for (var i = 0; i < doorways.length; i++) {
    if (doorwayId === doorways[i]['id']) {
      var hourlyDifference = moment().diff(moment(sinceDate), 'hours');
      var workWeekDifference = parseInt(hourlyDifference)*(5/7); // assuming you work M-F
      var workDayDifference = parseInt(workWeekDifference)*(1/2); // assuming you work for 12 hours
      doorways[i]['humansPerHour'] = Math.round(totalEvents/workDayDifference);
      doorways[i]['totalHumansSeen'] = totalEvents;
    }
  }
  return doorways;
}

export default function pilot(state=initialState, action) {
  switch (action.type) {
  case PILOT_UPDATE:
    return {...state, updated: new Date(), doorways: doorwaysWithUpdatedCountAndHourly(state.doorways, action.doorwayId, action.totalEvents, action.sinceDate)}
  default:
    return state;
  }
}