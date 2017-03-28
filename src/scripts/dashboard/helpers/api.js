import {API_URL} from 'dashboard/constants';


const api = {
  list(state, endpoint, baseUrl=API_URL) {
    return new Promise(function(resolve, reject) {
      fetch(`${baseUrl}${endpoint}`, {
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
            reject(detail);
          });
        } else {
          reject(response.statusText);
        }
      }).then(function(json) {
        resolve(json);
      }).catch(function(error) {
        reject(error);
      })
    })
  }
}

export default api;