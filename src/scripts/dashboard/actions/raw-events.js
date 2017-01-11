import moment from 'moment';

import {API_URL} from 'dashboard/constants';


export function rawEventsSetDateRange(dateRange) {
  return {
    type: 'RAW_EVENTS_SET_DATE_RANGE',
    dateRange: dateRange
  }
}

export function rawEventsChangePage(pageNum, pageSize) {
  return {
    type: 'RAW_EVENTS_CHANGE_PAGE',
    newPageNum: pageNum,
    pageSize: pageSize
  }
}


export function rawEventsFetch(startDate, endDate, pageNum, pageSize, spaceId) {
  return (dispatch, getState) => {
    let state = getState();
    startDate = moment(startDate).format('YYYY-MM-DD');
    endDate = moment(endDate).add(1, 'd').format('YYYY-MM-DD');
    let url = `${API_URL}/events/?start_time=${startDate}&end_time=${endDate}&page=${pageNum}&page_size=${pageSize}&space_id=${spaceId}`
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
      dispatch({type: 'RAW_EVENTS_SUCCESS', json: json});
    })
  }
}
