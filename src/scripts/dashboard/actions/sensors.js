import {API_URL} from 'dashboard/constants';

export function sensorsIndex() {
  return (dispatch, getState) => {
    let state = getState();
    return fetch(`${API_URL}/sensors?page_size=10000`, {
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
          dispatch(logoutUser());
          throw new Error(detail);
        });
      } else {
        throw new Error(response.statusText);
      }
    }).then(function(json) {
      dispatch({type: 'SENSORS_INDEX_SUCCESS', json: json});
    })
  }
}