import { core } from '../../client';
import collectionSpacesSet from '../collection/spaces/set';
import collectionSpacesError from '../collection/spaces/error';

export const ROUTE_TRANSITION_INSIGHTS_SPACE_TRENDS = 'ROUTE_TRANSITION_INSIGHTS_SPACE_TRENDS';

export default function routeTransitionInsightsSpaceTrends(id) {
  return async dispatch => {
    dispatch({ type: ROUTE_TRANSITION_INSIGHTS_SPACE_TRENDS, id });

    try {
      const spaces = await core.spaces.list();
      dispatch(collectionSpacesSet(spaces.results));
    } catch (err) {
      dispatch(collectionSpacesError(`Error loading space: ${err}`));
    }
  }
}
