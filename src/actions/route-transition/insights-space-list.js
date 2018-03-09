import { core } from '../../client';

import collectionSpacesSet from '../collection/spaces/set';
import collectionSpacesError from '../collection/spaces/error';

export const ROUTE_TRANSITION_INSIGHTS_SPACE_LIST = 'ROUTE_TRANSITION_INSIGHTS_SPACE_LIST';

export default function routeTransitionInsightsSpaceList() {
  return async dispatch => {
    dispatch({ type: ROUTE_TRANSITION_INSIGHTS_SPACE_LIST });

    try {
      const spaces = await core.spaces.list();
      dispatch(collectionSpacesSet(spaces.results));
    } catch (err) {
      dispatch(collectionSpacesError(err));
    }
  };
}
