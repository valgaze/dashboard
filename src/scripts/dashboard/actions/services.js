import {INTEGRATIONS_URL} from 'dashboard/constants';

export function servicesIndex() {
  return (dispatch, getState) => {
    let state = getState();
    fetch(`${INTEGRATIONS_URL}/services`, {
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
      dispatch({type: 'SERVICES_SUCCESS', json: json});
    }).catch(function(error) {
      console.log(error.message);
    })
  }
}
