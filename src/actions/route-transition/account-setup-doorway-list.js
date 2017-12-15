import collectionDoorwaysFetch from '../collection/doorways/fetch';

export const ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_LIST = 'ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_LIST';

export default function routeTransitionAccountSetupDoorwayList() {
  return dispatch => {
    dispatch({type: ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_LIST});
    dispatch(collectionDoorwaysFetch());
  };
}
