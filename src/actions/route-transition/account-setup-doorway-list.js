import { core } from '../../client';

import collectionDoorwaysSet from '../collection/doorways/set';
import collectionTokensError from '../collection/doorways/error';

export const ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_LIST = 'ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_LIST';

export default function routeTransitionAccountSetupDoorwayList() {
  return dispatch => {
    dispatch({type: ROUTE_TRANSITION_ACCOUNT_SETUP_DOORWAY_LIST});

    return core.doorways.list({environment: true}).then(doorways => {
      dispatch(collectionDoorwaysSet(doorways.results));
    }).catch(error => {
      dispatch(collectionTokensError(error));
    });
  };
}
