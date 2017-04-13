import moment from 'moment';
import 'moment-timezone';


import {API_URL} from 'dashboard/constants';

export const csv = {
  download(spaceId, startDate, endDate, timeZone) {
    return (dispatch, getState) => {
      let state = getState();
      
      startDate = moment(startDate).tz(timeZone).format("YYYY-MM-DDT00:00:00.000Z");
      endDate = moment(endDate).tz(timeZone).add(1, 'd').format("YYYY-MM-DDT00:00:00.000Z");

      var url = `${API_URL}/csv/?start_time=${startDate}&end_time=${endDate}`;
      if (spaceId) {
        var url = `${url}&space_id=${spaceId}`
      }
      
      dispatch({type: 'RAW_EVENTS_CSV_REQUEST'});
      fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.user.token}`
        },
      })
      .then(function(response) {
        if (response.ok) {
          return response.text();
        } else if (response.status == 403) {
          // TODO: have some global handler for catching un-authorized requests
          // redirect the user to the login screen?
          return response.text.then(({detail}) => {
            throw new Error(detail);
          });
        } else {
          throw new Error(response.statusText);
        }
      }).then(function(csv) {
        var data = new Blob([csv], {type: 'text/csv'});
        var csvURL = window.URL.createObjectURL(data);
        var tempLink = document.createElement('a');
        document.body.appendChild(tempLink);
        tempLink.href = csvURL;
        tempLink.setAttribute('download', 'currentevents.csv');
        tempLink.click();
        dispatch({type: 'RAW_EVENTS_CSV_SUCCESS'});
      }).catch(function(error) {
        console.log(error.message);
        dispatch({type: 'RAW_EVENTS_CSV_FAIL'});
      })
    }
  }
}