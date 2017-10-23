import pilotUpdate from '../pilot/update';

export const ROUTE_TRANSITION_PILOT = 'ROUTE_TRANSITION_PILOT';

export default function routeTransitionPilot() {  
  return (dispatch, getState) => {
    dispatch({ type: ROUTE_TRANSITION_PILOT });

    let state = getState();
    const doorways = state.pilot.doorways;
    for (var i = 0; i < doorways.length; i++) {
      dispatch(pilotUpdate(doorways[i]['id']));
    }
  };
}
