import {API_URL} from 'dashboard/constants';
import moment from 'moment';
import 'moment-timezone';


export function totalVisitsSetDateRange(dateRange) {
  return {
    type: 'TOTAL_VISITORS_SET_DATE_RANGE',
    dateRange: dateRange
  }
}

export function totalVisitsFetch(spaceId, timeZone) {
  return (dispatch, getState) => {
    let state = getState();
    let pageSize = 1;
    let dates = state.totalVisits.dates;
    var totalVisitorCounts = [];
    var promises = [];
    var timeZoneDates = [];

    // transform dates into correct timezone
    for (var i = 0; i < dates.length; i++) {
      timeZoneDates.push(moment(dates[i]).tz(timeZone).format("YYYY-MM-DDT00:00:00.000Z"));
    }

    for (var i = 0; i < timeZoneDates.length; i++) {
      let startTime = moment(timeZoneDates[i]).tz(timeZone).format("YYYY-MM-DDT00:00:00.000Z");
      let endTime = moment(startTime).tz(timeZone).add(1, 'd').format("YYYY-MM-DDT00:00:00.000Z");

      var promise = new Promise((resolve, reject) => {
        fetch(`${API_URL}/events/?start_time=${startTime}&end_time=${endTime}&page_size=${pageSize}&space_id=${spaceId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.user.token}`
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
          totalVisitorCounts[timeZoneDates.indexOf(startTime)] = dayCount;
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

