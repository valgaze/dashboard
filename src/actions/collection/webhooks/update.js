import collectionWebhooksPush from './push';
import { core } from '@density-int/client';

export const COLLECTION_WEBHOOKS_UPDATE = 'COLLECTION_WEBHOOKS_UPDATE';

export default function collectionWebhooksUpdate(item) {
  return dispatch => {
    dispatch({ type: COLLECTION_WEBHOOKS_UPDATE, item });

    return core.webhooks.update({
      id: item.id,
      name: item.name,
      description: item.description,
    }).then(whk => {
      dispatch(collectionWebhooksPush(whk));
    });
  };
}
