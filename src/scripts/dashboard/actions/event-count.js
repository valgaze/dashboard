import moment from 'moment';

import {API_URL} from 'dashboard/constants';

export function eventCountSetDate(date) {
  return {
    type: 'EVENT_COUNT_SET_DATE',
    date: date
  }
}

function fetchEventsByPage(dispatch, token, startTime, endTime, spaceId, pageNum, pageSize, events=[]) {
  let url = `${API_URL}/events/?start_time=${startTime}&end_time=${endTime}&page=${pageNum}&page_size=${pageSize}&space_id=${spaceId}`
  fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  .then(function(response) {
    if (response.ok) {
      return response.json();
    } else if (response.status == 403) {
      return response.json().then(({detail}) => {
        throw new Error(detail);
      });
    } else {
      throw new Error(response.statusText);
    }
  }).then(function(json) {
    events = events.length == 0 ? json.results : events.concat(json.results);
    if (json.next != null) {
      return fetchEventsByPage(dispatch, token, startTime, endTime, spaceId, pageNum+1, pageSize, events);
    } else {
      dispatch({type: 'EVENT_COUNT_SUCCESS_APPEND', rawEventData: events});
      return;
    }
  }).catch(function(error) {
    console.log(error);
  })
}

export function eventCountFetch(date, spaceId) {
  return (dispatch, getState) => {
    let state = getState();
    let pageSize = 50000;
    var promises = [];
    var eventData = [];
    let token = state.user.token;
    let pageNum = 1;
    let startTime = moment(date).format("YYYY-MM-DD")+"T09:00:00";
    let endTime = moment(date).add(1, 'd').format("YYYY-MM-DD")+"T00:00:00";

    let timezone = state.spaces.currentObj.timezone;
    var tempTimezoneString = "T00:00:00"+timezone;
    if(timezone==null) {
      return;
    }

    let startTimeAdjusted = startTime+tempTimezoneString;
    let endTimeAdjusted = endTime+tempTimezoneString;

    dispatch({type: 'EVENT_COUNT_BEGIN_REQUEST'});
    fetchEventsByPage(dispatch, token, startTimeAdjusted, endTimeAdjusted, spaceId, pageNum, pageSize);
  }
}

