export function eventsGet(jwt, page, pageSize) {
  return dispatch => {
    var url = `https://api.density.io/v1/events/?start_time=2016-10-01&page=${page}&page_size=${pageSize}`
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
    })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else if (response.status == 403) {
        // TODO: have some global handler for catching un-authorized requests
        // redirect the user to the login screen?
        return response.json().then(({detail}) => {
          throw new Error(detail);
        });
      } else {
        throw new Error(response.statusText);
      }
    }).then(function(json) {
      dispatch({type: 'EVENTS_SUCCESS', json: json});
    }).catch(function(error) {
      console.log(error.message);
    })
  }
}
