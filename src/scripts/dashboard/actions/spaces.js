import {API_URL} from 'dashboard/constants';

export function spacesToggleEditCount(editingCurrentCount) {
  return dispatch => {
    dispatch({
      type: 'SPACES_TOGGLE_EDIT_COUNT', 
      editingCurrentCount: editingCurrentCount
    });
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
      var newCurrentObj = state.spaces.currentObj;
      newCurrentObj.current_count = json.count;
      dispatch({type: 'SPACES_UPDATE_COUNT_SUCCESS', newCurrentObj: newCurrentObj});
    })
  }
}


export function spacesIncreaseCount() {
  return (dispatch, getState) => {
    let state = getState();
    let newTempCount = state.spaces.tempCount+1;
    dispatch({
      type: 'SPACES_NEW_TEMP_COUNT', 
      newTempCount: newTempCount
    });
  }
};

export function spacesDecreaseCount() {
  return (dispatch, getState) => {
    let state = getState();
    let newTempCount = Math.max(0, state.spaces.tempCount-1);
    dispatch({
      type: 'SPACES_NEW_TEMP_COUNT', 
      newTempCount: newTempCount
    });
  }
};

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
    dispatch({type: 'SPACES_READ_REQUEST'});
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
