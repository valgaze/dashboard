import {API_URL} from 'dashboard/constants';
import moment from 'moment';

export function totalVisitsSetDateRange(dateRange) {
  return {
    type: 'TOTAL_VISITORS_SET_DATE_RANGE',
    dateRange: dateRange
  }
}

export function totalVisitsFetch(spaceId) {
  return (dispatch, getState) => {
    let state = getState();
    let pageSize = 1;
    let dates = state.totalVisits.dates;
    var totalVisitorCounts = [];
    var promises = [];
    var timezone = state.spaces.currentObj.timezone;
    var tempTimezoneString = "T00:00:00"+timezone;

    if(timezone==null) {
      return;
    }

    for (var i = 0; i < dates.length; i++) {
      let startTime = dates[i];
      let endTime = moment(startTime).add(1, 'd').format("YYYY-MM-DD");

      let startTimeAdjusted = startTime+tempTimezoneString;
      let endTimeAdjusted = endTime+tempTimezoneString;

      var promise = new Promise((resolve, reject) => {
        fetch(`${API_URL}/events/?start_time=${startTimeAdjusted}&end_time=${endTimeAdjusted}&page_size=${pageSize}&space_id=${spaceId}`, {
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
            return response.json().then(({detail}) => {
              throw new Error(detail);
            });
          } else {
            throw new Error(response.statusText);
          }
        }).then(function(json) {
          // TODO: Come up with a better metric than dividing by two
          // TODO: Come up with a better way to insure the order of the count data
          var dayCount = Math.round(json.count/2);
          totalVisitorCounts[dates.indexOf(startTime)] = dayCount;
          resolve();
        }).catch(function(error) {
          console.log(error.message);
        })
      });
      promises.push(promise);
    }
    Promise.all(promises).then(values => { 
      dispatch({type: 'TOTAL_VISITORS_SET_VISITOR_COUNTS', newCounts: totalVisitorCounts});
    }).catch(reason => { 
      console.log(reason)
    });
  }
}

