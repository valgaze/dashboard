import { core } from '../../client';
import collectionSpacesPush from '../collection/spaces/push';

export const ROUTE_TRANSITION_VISUALIZATION_SPACE_DETAIL = 'ROUTE_TRANSITION_VISUALIZATION_SPACE_DETAIL';

export default function routeTransitionSpaceDetail(id) {
  return dispatch => {
    dispatch({ type: ROUTE_TRANSITION_VISUALIZATION_SPACE_DETAIL, id })

    return core.spaces.get({id}).then(space => {
      dispatch(collectionSpacesPush(space));
    });
  }
}
