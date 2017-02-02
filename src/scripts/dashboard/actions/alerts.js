import {INTEGRATIONS_URL} from 'dashboard/constants';

export function alertsGenerateNewAlert() {
  return {
    type: 'ALERTS_NEW_ALERT'
  }
}

export function alertsEdit(alertId) {
  return {
    type: 'ALERTS_EDIT_ALERT',
    alertId: alertId
  }
}

export function alertsCancel(alertId) {
  return {
    type: 'ALERTS_CANCEL_ALERT',
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

export function alertsToggleEnabled(alertId, mode, enabled) {
  if (mode == "new") {
    return {
      type: 'ALERTS_TOGGLE_ENABLED',
      alertId: alertId
    }  
  } else {
    var params = {enabled: !enabled}
    return alertsUpdate(alertId, params);
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
      dispatch({type: 'ALERTS_SUCCESS', json: json});
    }).catch(function(error) {
      console.log(error.message);
    })
  }
}

export function alertsSave(alertId, compareValue, spaceId, enabled, channel) {
  var params = {
    compare_value: compareValue,
    space_id: spaceId,
    enabled: enabled,
    channel: channel
  }
  return alertsUpdate(alertId, params);
}


export function alertsUpdate(alertId, params) {
  return (dispatch, getState) => {
    let state = getState();
    fetch(`${INTEGRATIONS_URL}/alerts/${alertId}`, {
      method: 'PATCH',
      body: JSON.stringify(params),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.user.token}`
      },
    })
    .then(function(response) {
      if (response.status == 204) {
        return;
      } else if (response.status == 403) {
        return response.json().then(({detail}) => {
          throw new Error(detail);
        });
      } else {
        throw new Error(response.statusText);
      }
    }).then(function() {
      dispatch(alertsIndex());
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
        'Authorization': `Bearer ${state.user.token}`
      },
    })
    .then(function(response) {
      if (response.status == 204) {
        return;
      } else if (response.status == 403) {
        return response.json().then(({detail}) => {
          throw new Error(detail);
        });
      } else {
        throw new Error(response.statusText);
      }
    }).then(function() {
      dispatch({type: 'ALERTS_DELETE_SUCCESS', alertId: alertId});
    }).catch(function(error) {
      console.log(error.message);
    })
  }
}