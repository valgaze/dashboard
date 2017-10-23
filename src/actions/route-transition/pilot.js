import { core, accounts } from '@density-int/client';
import pilotUpdate from '../pilot/update';
import pilotSet from '../pilot/set';

export const ROUTE_TRANSITION_PILOT = 'ROUTE_TRANSITION_PILOT';

export default function routeTransitionPilot() {  
  return (dispatch, getState) => {
    dispatch({ type: ROUTE_TRANSITION_PILOT });

    let state = getState();

    accounts.users.me(state.sessionToken).then(data => data)
    .then(data => {
      let orgId = data['organization']['id'];
      let configURL = "https://s3.amazonaws.com/dashboard.density.io/vids/"+orgId+".json";

      fetch(configURL, {method: 'GET'})
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        dispatch(pilotSet(json));
        let doorways = json['doorways'];
        for (var i = 0; i < doorways.length; i++) {
          dispatch(pilotUpdate(doorways[i]['id']));
        }
      });

    });
    
  };
}
