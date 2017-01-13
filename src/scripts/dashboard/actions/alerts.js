import {INTEGRATIONS_URL} from 'dashboard/constants';

export function alertsGenerateNewAlert() {
  return {
    type: 'ALERTS_NEW_ALERT'
  }
}

export function alertsCancelCreation(alertId) {
  return {
    type: 'ALERTS_CANCEL_NEW_ALERT',
    alertId: alertId
  }
}

export function alertsUpdateFormField(alertId, field, value) {
  return {
    type: 'ALERTS_UPDATE_FORM_FIELD',
    alertId: alertId,
    field: field,
    value: value
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

export function alertsCreate(compareValue, spaceId, enabled, channel) {
  return (dispatch, getState) => {
    let state = getState();
    var params = {
      "condition": "equal",
      "compare_value": compareValue,
      "space_id": spaceId,
      "enabled": enabled,
      "channel": channel
    }
    fetch(`${INTEGRATIONS_URL}/alerts/slack`, {
      method: 'POST',
      body: JSON.stringify(params),
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
      dispatch(alertsIndex());
    }).catch(function(error) {
      console.log(error.message);
    })
  }
}

export function alertsDelete(alertId) {
  return (dispatch, getState) => {
    let state = getState();
    fetch(`${INTEGRATIONS_URL}/alerts/${alertId}`, {
      method: 'DELETE',
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
      dispatch({type: 'ALERTS_DELETE_SUCCESS', alertId: alertId});
    }).catch(function(error) {
      console.log(error.message);
    })
  }
}