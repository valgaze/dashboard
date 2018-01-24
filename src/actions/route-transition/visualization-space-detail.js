import { core } from '../../client';
import collectionSpacesPush from '../collection/spaces/push';
import collectionSpacesError from '../collection/spaces/error';

export const ROUTE_TRANSITION_VISUALIZATION_SPACE_DETAIL = 'ROUTE_TRANSITION_VISUALIZATION_SPACE_DETAIL';

export default function routeTransitionSpaceDetail(id) {
  return async dispatch => {
    dispatch({ type: ROUTE_TRANSITION_VISUALIZATION_SPACE_DETAIL, id })

    try {
      const space = await core.spaces.get({id})
      dispatch(collectionSpacesPush(space));
    } catch (err) {
      dispatch(collectionSpacesError(`Error loading space: ${err}`));
    }
  }
}
