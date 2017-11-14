import { core } from '@density-int/client';

import collectionDoorwaysSet from '../collection/doorways/set';

export const ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_LIST = 'ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_LIST';

export default function routeTransitionAccountSetupDoorwayList() {
  return dispatch => {
    dispatch({type: ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_LIST});

    return core.doorways.list().then(doorways => {
      dispatch(collectionDoorwaysSet(doorways.results));
    });
  };
}
