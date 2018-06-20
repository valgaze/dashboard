import clientele from '@density/clientele';

import sessionTokenUnSet from '../actions/session-token/unset';
import userError from '../actions/user/error';

let store;
function setStore(s) { store = s; }

async function errorHandler(response) {
  // If the user received a 403 in response to any request, send them to the login page.
  // Redirect the user to the login page and remove the bad session token from
  // the reducer.
  if (response.status === 403) {
    store.dispatch(userError(`Login session has expired or is invalid. Please login again.`));
    store.dispatch(sessionTokenUnSet());
    window.location.href = '#/login';
  }

  // If the response wasn't a 403, then return the best representation of the error.
  const data = await response.json();
  return data.detail || data.error || JSON.stringify(data);
}

const core = clientele({...require('./specs/core-api'), errorFormatter: errorHandler});
const accounts = clientele({...require('./specs/accounts-api'), errorFormatter: errorHandler});
const telemetry = clientele({...require('./specs/telemetry-api'), errorFormatter: errorHandler});

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
      return Promise.reject(await errorHandler(response));
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
      return Promise.reject(await errorHandler(response));
    }
  });
};

export {
  core,
  accounts,
  telemetry,

  setStore,
};

export default core;
