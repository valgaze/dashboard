import {API_URL} from 'dashboard/constants';


export function spacesFormFieldUpdate(field, value) {
  return {
    type: 'SPACES_FORM_FIELD_UPDATE',
    field: field,
    value: value
  }
};

export function spacesToggleEditCount(editingCurrentCount) {
  return {
    type: 'SPACES_TOGGLE_EDIT_COUNT', 
    editingCurrentCount: editingCurrentCount
  }
};

export function spacesToggleEditDetails(editingSpaceDetails) {
  return {
    type: 'SPACES_TOGGLE_EDIT_DETAILS',
    editingSpaceDetails: editingSpaceDetails
  }
};

export function spacesIncreaseCount() {
  return {
    type: 'SPACES_NEW_TEMP_COUNT', 
    countChange: 1
  }
};

export function spacesDecreaseCount() {
  return {
    type: 'SPACES_NEW_TEMP_COUNT', 
    countChange: -1
  }
};

export function spacesSaveTempCount() {
  return (dispatch, getState) => {
    dispatch({type: 'SPACES_UPDATE_COUNT_REQUEST'});
    let state = getState();
    var params = {
      space_id: state.spaces.currentObj.id,
      count: state.spaces.tempCount
    }

    return fetch(`${API_URL}/resets/`, {
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
      dispatch({type: 'SPACES_UPDATE_COUNT_SUCCESS', json: json});
    })
  }
}

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
    dispatch({type: 'SPACES_READ_REQUEST', spaceId: spaceId});
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

export function spacesUpdate() {
  return (dispatch, getState) => {
    dispatch({type: 'SPACES_UPDATE_REQUEST'});
    let state = getState();
    var params = {
      name: state.spaces.tempName
    }

    return fetch(`${API_URL}/spaces/${state.spaces.currentObj.id}/`, {
      method: 'PUT',
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
      dispatch({type: 'SPACES_UPDATE_SUCCESS', json: json});
    })
  }
};
