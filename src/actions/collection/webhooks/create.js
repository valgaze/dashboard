import collectionWebhooksPush from './push';
import { core } from '@density-int/client';

export const COLLECTION_WEBHOOKS_CREATE = 'COLLECTION_WEBHOOKS_CREATE';

export default function collectionWebhooksCreate(webhook) {
  return dispatch => {
    dispatch({ type: COLLECTION_WEBHOOKS_CREATE, item: webhook });

    return core.webhooks.create({
      name: webhook.name,
      description: webhook.desc,
      endpoint: webhook.endpoint,
    }).then(webhook => {
      dispatch(collectionWebhooksPush(webhook));
    });
  };
}
