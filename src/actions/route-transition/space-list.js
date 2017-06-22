import { core } from '@density-int/client';
import collectionSpacesSet from '../collection/spaces-set';

export const ROUTE_TRANSITION_SPACE_LIST = 'ROUTE_TRANSITION_SPACE_LIST';

export default function routeTransitionSpaceList() {
  return dispatch => {
    dispatch({ type: ROUTE_TRANSITION_SPACE_LIST });

    // Fetch a list of all spaces.
    return core.spaces.list().then(spaces => {
      dispatch(collectionSpacesSet(spaces.results));
    });
  };
}
