import { core } from '../../client';
import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';

export const ROUTE_TRANSITION_DASHBOARD_LIST = 'ROUTE_TRANSITION_DASHBOARD_LIST';

export default function routeTransitionDashboardList() {
  return async dispatch => {
    dispatch({ type: ROUTE_TRANSITION_DASHBOARD_LIST });

    const dashboards = await core.dashboards.list({page: 1, page_size: 1});
    if (dashboards.length === 0) {
      console.warn('Display an error about no dashboards being available');
      return;
    }

    const results = objectSnakeToCamel(dashboards.results[0]);
    window.location.href = `#/dashboards/${results.id}`;
  };
}
