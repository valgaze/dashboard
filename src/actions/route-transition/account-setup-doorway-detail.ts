import collectionDoorwaysFetch from '../collection/doorways/fetch';

export const ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_DETAIL = 'ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_DETAIL';

export default function routeTransitionAccountSetupDoorwayDetail(id) {
  return dispatch => {
    dispatch({ type: ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_DETAIL, id });
    dispatch(collectionDoorwaysFetch());
  };
}
