import { core } from '../../client';
import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';
import collectionDashboardsSet from '../collection/dashboards/set';
import collectionDashboardsError from '../collection/dashboards/error';
import collectionDashboardsSelect from '../collection/dashboards/select';

import fetchAllPages from '../../helpers/fetch-all-pages/index';

export const ROUTE_TRANSITION_DASHBOARD_DETAIL = 'ROUTE_TRANSITION_DASHBOARD_DETAIL';

export default function routeTransitionDashboardDetail(id) {
  return async dispatch => {
    dispatch({ type: ROUTE_TRANSITION_DASHBOARD_DETAIL });

    // Though this route is only to load a single dashboard, we need to load all dashboards in order
    // to render the list on the left side of the screen.

    let dashboards;
    try {
      dashboards = await fetchAllPages(page => core.dashboards.list({page, page_size: 5000}));
    } catch (err) {
      dispatch(collectionDashboardsError(err));
      return;
    }

    const results = dashboards.map(objectSnakeToCamel);
    dispatch(collectionDashboardsSet(results));

    if (results.length === 0) {
      console.warn('Display an error relating to when there are no dashboards and something about contacting your density account manager');
      return;
    }

    // If the dashboard that should be selected is in the response, then select it
    const selectedDashboard = results.find(dashboard => dashboard.id === id);
    if (!selectedDashboard) {
      console.warn('Do the equivelent of a 404 not found type of error here');
      return;
    }
    await dispatch(collectionDashboardsSelect(selectedDashboard));
  };
}
