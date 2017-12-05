var clientele = require('@density/clientele');

// Given a response obejct from a fetch call, return the error message that should be returned.
function errorFormatter(response) {
  return response.json().then(function(data) {
    return data.detail || data.error || JSON.stringify(data);
  });
}

var core = clientele(Object.assign({}, require('./specs/core-api'), {errorFormatter: errorFormatter}));
var accounts = clientele(Object.assign({}, require('./specs/accounts-api'), {errorFormatter: errorFormatter}));
var metrics = clientele(Object.assign({}, require('./specs/metrics-api'), {errorFormatter: errorFormatter}));

core.doorways.create = function(data) {
  return window.fetch(`${core.config().core}/doorways?environment=True`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${core.config().token}`,
    },
    body: JSON.stringify(data),
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return errorFormatter(response);
    }
  });
};

core.doorways.update = function(data) {
  return window.fetch(`${core.config().core}/doorways/${data.id}?environment=True`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${core.config().token}`,
    },
    body: JSON.stringify(data),
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return errorFormatter(response);
    }
  });
};

module.exports = {
  default: core,
  core: core,
  accounts: accounts,
  metrics: metrics,
};
