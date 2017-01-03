import moment from 'moment';

import {API_URL} from 'dashboard/constants';

export function eventCountSetDate(date) {
  return {
    type: 'EVENT_COUNT_SET_DATE',
    date: date
  }
}

export function eventCountFetch(date, spaceId) {
  return (dispatch, getState) => {
    let state = getState();
    let pageSize = 50000;
    let pageNum = 1;
    // let startTime = date.format();
    // let endTime = date.add(1, 'd').format();
    let startTime = moment().toDate();
    let endTime = moment().add(1, 'd').toDate();

    
    let url = `${API_URL}/events/?start_time=${startTime}&end_time=${endTime}&page=${pageNum}&page_size=${pageSize}&space_id=${spaceId}`
    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.user.jwt}`
      },
    })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else if (response.status == 403) {
        // redirect the user to the login screen?
        return response.json().then(({detail}) => {
          throw new Error(detail);
        });
      } else {
        throw new Error(response.statusText);
      }
    }).then(function(json) {
      dispatch({type: 'EVENT_COUNT_SUCCESS', json: json});
    })
  }
}

