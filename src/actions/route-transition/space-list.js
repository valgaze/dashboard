import { core } from '@density-int/client';
import collectionSpacesSet from '../collection/spaces-set';
import collectionDoorwaysSet from '../collection/doorways-set';
import collectionLinksSet from '../collection/links-set';

export const ROUTE_TRANSITION_SPACE_LIST = 'ROUTE_TRANSITION_SPACE_LIST';

export default function routeTransitionSpaceList() {
  return dispatch => {
    dispatch({ type: ROUTE_TRANSITION_SPACE_LIST });

    return Promise.all([
      // Fetch a list of all spaces.
      core.spaces.list(),
      // Fetch a list of all doorways.
      core.doorways.list(),
      // Fetch a list of all links.
      core.links.list(),
    ]).then(([spaces, doorways, links]) => {
      dispatch(collectionSpacesSet(spaces.results));
      dispatch(collectionDoorwaysSet(doorways.results));
      dispatch(collectionLinksSet(links.results));
    });
  };
}
