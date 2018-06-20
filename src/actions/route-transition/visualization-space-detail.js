import { core } from '../../client';
import collectionSpacesSet from '../collection/spaces/set';
import collectionSpacesError from '../collection/spaces/error';

export const ROUTE_TRANSITION_VISUALIZATION_SPACE_DETAIL = 'ROUTE_TRANSITION_VISUALIZATION_SPACE_DETAIL';

export default function routeTransitionSpaceDetail(id) {
  return async dispatch => {
    dispatch({ type: ROUTE_TRANSITION_VISUALIZATION_SPACE_DETAIL, id });

    try {
      const spaces = await core.spaces.list();
      dispatch(collectionSpacesSet(spaces.results));
    } catch (err) {
      dispatch(collectionSpacesError(`Error loading space: ${err}`));
    }
  }
}
