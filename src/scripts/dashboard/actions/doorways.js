import {API_URL} from 'dashboard/constants';

export function doorwaysIndex() {
  return (dispatch, getState) => {
    let state = getState();
    fetch(`${API_URL}/doorways/`, {
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
        // TODO: have some global handler for catching un-authorized requests
        // redirect the user to the login screen?
        return response.json().then(({detail}) => {
          throw new Error(detail);
        });
      } else {
        throw new Error(response.statusText);
      }
    }).then(function(json) {
      dispatch({type: 'DOORWAYS_SUCCESS', json: json});
    }).catch(function(error) {
      console.log(error.message);
    })
  }
}
