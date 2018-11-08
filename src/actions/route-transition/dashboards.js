import { core } from '../../client';
import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';
import collectionDashboardsSet from '../collection/dashboards/set';
import collectionDashboardsSelect from '../collection/dashboards/select';

export const ROUTE_TRANSITION_DASHBOARDS = 'ROUTE_TRANSITION_DASHBOARDS';

export default function routeTransitionDashboards() {
  return async dispatch => {
    dispatch({ type: ROUTE_TRANSITION_DASHBOARDS });

    const dashboards = await core.dashboards.list();
    const results = dashboards.results.map(objectSnakeToCamel);
    dispatch(collectionDashboardsSet(results));

    // If a dashboard exists, then initially select it.
    if (results.length > 0) {
      await dispatch(collectionDashboardsSelect(results[0]));
    }
  };
}
