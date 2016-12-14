import {API_URL} from 'dashboard/constants';

export function spacesIndex() {
  return (dispatch, getState) => {
    let state = getState();
    return fetch(`${API_URL}/spaces/`, {
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
        // TODO: have some global handler for catching un-authorized requests
        // redirect the user to the login screen?
        return response.json().then(({detail}) => {
          throw new Error(detail);
        });
      } else {
        throw new Error(response.statusText);
      }
    }).then(function(json) {
      dispatch({type: 'SPACES_INDEX_SUCCESS', json: json});
    })
  }
}

export function spacesRead(spaceId) {
  return (dispatch, getState) => {
    let state = getState();
    return fetch(`${API_URL}/spaces/${spaceId}/`, {
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
      dispatch({type: 'SPACES_READ_SUCCESS', json: json});
    })
  }
}
