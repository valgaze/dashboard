import { core } from '../../client';
import collectionWebhooksSet from '../collection/webhooks/set';
import collectionWebhooksError from '../collection/webhooks/error';
import errorHelper from '../../helpers/error-helper/index';

export const ROUTE_TRANSITION_DEV_WEBHOOK_LIST = 'ROUTE_TRANSITION_DEV_WEBHOOK_LIST';

export default function routeTransitionDevWebhookList() {
  return dispatch => {
    dispatch({ type: ROUTE_TRANSITION_DEV_WEBHOOK_LIST });

    return errorHelper({
      try: () => core.webhooks.list(),
      catch: error => {
        dispatch(collectionWebhooksError(error));
      },
      else: async request => {
        const webhooks = await request;
        dispatch(collectionWebhooksSet(webhooks.results));
      },
    });
  };
}
