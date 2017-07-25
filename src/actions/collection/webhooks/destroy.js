import collectionWebhooksDelete from './delete';
import { core } from '@density-int/client';

export const COLLECTION_WEBHOOKS_DESTROY = 'COLLECTION_WEBHOOKS_DESTROY';

export default function collectionWebhooksDestroy(item) {
  return dispatch => {
    dispatch({ type: COLLECTION_WEBHOOKS_DESTROY, item });

    return core.webhooks.delete({id: item.id}).then(() => {
      dispatch(collectionWebhooksDelete(item));
    });
  };
}
