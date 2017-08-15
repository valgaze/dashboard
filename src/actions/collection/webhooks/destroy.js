import collectionWebhooksDelete from './delete';
import { core } from '@density-int/client';
import collectionWebhooksError from './error';

export const COLLECTION_WEBHOOKS_DESTROY = 'COLLECTION_WEBHOOKS_DESTROY';

export default function collectionWebhooksDestroy(item) {
  return async dispatch => {
    dispatch({ type: COLLECTION_WEBHOOKS_DESTROY, item });

    try {
      const response = await core.webhooks.delete({id: item.id});
      dispatch(collectionWebhooksDelete(item));
      return response;
    } catch (err) {
      dispatch(collectionWebhooksError(err));
      return false;
    }
  };
}
