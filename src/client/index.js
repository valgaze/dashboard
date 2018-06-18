import clientele from '@density/clientele';

import sessionTokenUnSet from '../actions/session-token/unset';
import userError from '../actions/user/error';

let store;
function setStore(s) { store = s; }

// Given a response obejct from a fetch call, return the error message that should be returned.
function errorFormatter(response) {
  // If the user received a 403 in response to any request, send them to the login page.
  // Redirect the user to the login page and remove the bad session token from
  // the reducer.
  if (response.status === 403) {
    store.dispatch(userError(`Login session has expired or is invalid. Please login again.`));
    store.dispatch(sessionTokenUnSet());
    window.location.href = '#/login';
  }

  return response.json().then(function(data) {
    return data.detail || data.error || JSON.stringify(data);
  });
}

const core = clientele({...require('./specs/core-api'), errorFormatter});
const accounts = clientele({...require('./specs/accounts-api'), errorFormatter});
const metrics = clientele({...require('./specs/metrics-api'), errorFormatter});

core.doorways.create = function(data) {
  return fetch(`${core.config().core}/doorways?environment=True`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${core.config().token}`,
    },
    body: JSON.stringify(data),
  }).then(async response => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(await errorFormatter(response));
    }
  });
};

core.doorways.update = function(data) {
  return fetch(`${core.config().core}/doorways/${data.id}?environment=True`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${core.config().token}`,
    },
    body: JSON.stringify(data),
  }).then(async response => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(await errorFormatter(response));
    }
  });
};

export {
  core,
  accounts,
  metrics,

  setStore,
};

export default core;
