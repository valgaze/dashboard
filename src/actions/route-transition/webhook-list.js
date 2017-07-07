import { core } from '@density-int/client';
import collectionWebhooksSet from '../collection/webhooks/set';

export const ROUTE_TRANSITION_WEBHOOK_LIST = 'ROUTE_TRANSITION_WEBHOOK_LIST';

export default function routeTransitionWebhookList() {
  return dispatch => {
    dispatch({ type: ROUTE_TRANSITION_WEBHOOK_LIST });

    return core.webhooks.list().then(webhooks => {
      dispatch(collectionWebhooksSet(webhooks.results));
    });
  };
}
