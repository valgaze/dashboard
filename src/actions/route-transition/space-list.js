import { core } from '@density-int/client';
import collectionSpacesSet from '../collection/spaces-set';
import collectionDoorwaysSet from '../collection/doorways-set';

export const ROUTE_TRANSITION_SPACE_LIST = 'ROUTE_TRANSITION_SPACE_LIST';

export default function routeTransitionSpaceList() {
  return dispatch => {
    dispatch({ type: ROUTE_TRANSITION_SPACE_LIST });

    return Promise.all([
      // Fetch a list of all spaces.
      core.spaces.list(),
      // Fetch a list of all doorways.
      core.doorways.list(),
    ]).then(([spaces, doorways]) => {
      dispatch(collectionSpacesSet(spaces.results));
      dispatch(collectionDoorwaysSet(doorways.results));
    });
  };
}
