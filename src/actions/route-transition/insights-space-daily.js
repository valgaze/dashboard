import { core } from '../../client';
import collectionSpacesSet from '../collection/spaces/set';
import collectionSpacesError from '../collection/spaces/error';

export const ROUTE_TRANSITION_INSIGHTS_SPACE_DAILY = 'ROUTE_TRANSITION_INSIGHTS_SPACE_DAILY';

export default function routeTransitionInsightsSpaceDaily(id) {
  return async dispatch => {
    dispatch({ type: ROUTE_TRANSITION_INSIGHTS_SPACE_DAILY, id });

    try {
      const spaces = await core.spaces.list();
      dispatch(collectionSpacesSet(spaces.results));
    } catch (err) {
      dispatch(collectionSpacesError(`Error loading space: ${err}`));
    }
  }
}
