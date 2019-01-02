import { core } from '../../client';
import collectionWebhooksSet from '../collection/webhooks/set';

export const ROUTE_TRANSITION_DEV_WEBHOOK_LIST = 'ROUTE_TRANSITION_DEV_WEBHOOK_LIST';

export default function routeTransitionDevWebhookList() {
  return dispatch => {
    dispatch({ type: ROUTE_TRANSITION_DEV_WEBHOOK_LIST });

    return core.webhooks.list().then(webhooks => {
      dispatch(collectionWebhooksSet(webhooks.results));
    });
  };
}
