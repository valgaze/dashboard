import {INTEGRATIONS_URL} from 'dashboard/constants';

export function alertsGenerateNewAlert() {
  return {
    type: 'ALERTS_NEW_ALERT'
  }
}

export function alertsToggleEnabled(alertId) {
  return {
    type: 'ALERTS_TOGGLE_ENABLED',
    alertId: alertId
  }
}

export function alertsIndex() {
  return (dispatch, getState) => {
    let state = getState();
    fetch(`${INTEGRATIONS_URL}/alerts`, {
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
      dispatch({type: 'ALERTS_SUCCESS', json: json});
    }).catch(function(error) {
      console.log(error.message);
    })
  }
}
