import sessionTokenUnset from '../session-token/unset';
import collectionSpacesSet from '../collection/spaces/set';
import collectionDoorwaysSet from '../collection/doorways/set';
import collectionLinksSet from '../collection/links/set';


export default function routeTransitionLogout() {
  return dispatch => {
    dispatch(sessionTokenUnset());
    dispatch(collectionSpacesSet([]));
    dispatch(collectionDoorwaysSet([]));
    dispatch(collectionLinksSet([]));
    window.location.hash = '#/login';
  };
}
