import { core } from '@density-int/client';

import collectionDoorwaysSet from '../collection/doorways/set';
import collectionTokensError from '../collection/doorways/error';

export const ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_DETAIL = 'ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_DETAIL';

export default function routeTransitionAccountSetupDoorwayDetail(id) {
  return dispatch => {
    dispatch({ type: ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_DETAIL, id });

    return core.doorways.list({environment: true}).then(doorways => {
      dispatch(collectionDoorwaysSet(doorways.results));
    }).catch(error => {
      dispatch(collectionTokensError(error));
    });
  };
}
