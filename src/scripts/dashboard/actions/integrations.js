import {INTEGRATIONS_URL, SLACK_REDIRECT_URI} from 'dashboard/constants';
import {DensityToaster} from 'dashboard/components/DensityToaster';

export function servicesIndex() {
  return (dispatch, getState) => {
    let state = getState();
    fetch(`${INTEGRATIONS_URL}/services`, {
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
      dispatch({type: 'SERVICES_SUCCESS', json: json});
    }).catch(function(error) {
      console.log(error.message);
    })
  }
}

export function servicesSendSlackCode(code) {
  return (dispatch, getState) => {
    dispatch({type: 'SERVICES_SLACK_CODE_REQUEST'});
    let state = getState();
    var params = {"code": code, "redirect_uri": SLACK_REDIRECT_URI};
    fetch(`${INTEGRATIONS_URL}/services/slack/callback`, {
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
      dispatch({type: 'SERVICES_SLACK_CODE_SUCCESS'});
      dispatch(servicesIndex());
      dispatch(servicesSlackChannels());
    }).catch(function(error) {
      console.log(error.message);
      dispatch({type: 'SERVICES_SLACK_CODE_FAIL'});
      return DensityToaster.show({ message: "Could not connect to Slack.", timeout: 8000, className: "pt-intent-danger" });
    })
  }
}


export function servicesSlackChannels() {
  return (dispatch, getState) => {
    let state = getState();
    fetch(`${INTEGRATIONS_URL}/services/slack/channels`, {
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
      dispatch({type: 'SERVICES_SLACK_CHANNELS_SUCCESS', json: json});
    }).catch(function(error) {
      console.log(error.message);
    })
  }
}
