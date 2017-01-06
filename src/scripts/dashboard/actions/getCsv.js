import {API_URL} from 'dashboard/constants';

export function getCsv(spaceId, startDate, endDate) {
  return (dispatch, getState) => {
    let state = getState();
    fetch(`${API_URL}/csv/?start_time=${startDate}&&space_id=${spaceId}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.user.jwt}`
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
      tempLink.href = csvURL;
      tempLink.setAttribute('download', 'currentevents.csv');
      tempLink.click();
    }).catch(function(error) {
      console.log(error.message);
    })
  }
}
