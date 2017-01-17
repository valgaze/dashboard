import {API_URL} from 'dashboard/constants';

export function eventsIndex(pageNum, pageSize) {
  return (dispatch, getState) => {
    let state = getState();
    let url = `${API_URL}/events/?start_time=2016-10-01&page=${pageNum}&page_size=${pageSize}`
    return fetch(url, {
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
      dispatch({type: 'EVENTS_SUCCESS', json: json});
    })
  }
}

export function eventsSimulateEvent(doorwayId, direction) {
  return (dispatch, getState) => {
    let state = getState();

    var sensorId;
    var sensors = state.sensors.results;
    for (var i = 0; i < sensors.length; i++) {
      if(sensors[i].doorway_id === doorwayId) {
        sensorId = sensors[i].id;
        break;
      }
    }

    var params = {
      sensor_id: sensorId,
      direction: direction
    }

    return fetch(`${API_URL}/events/`, {
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
      dispatch({type: 'EVENTS_SIMULATE_EVENT_SUCCESS', json: json});
    })
  }
}