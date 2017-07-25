import collectionWebhooksPush from './push';
// import { accounts } from '@density-int/client';

export const COLLECTION_WEBHOOKS_UPDATE = 'COLLECTION_WEBHOOKS_UPDATE';

export default function collectionWebhooksUpdate(item) {
  return dispatch => {
    dispatch({ type: COLLECTION_WEBHOOKS_UPDATE, item });
    dispatch(collectionWebhooksPush(item));

    // TODO: can't update without name and description fields
    // return core.webhooks.update({
    //   id: item.id
    //   name: item.name,
    //   description: item.desc,
    //   token_type: item.tokenType,
    // }).then(tok => {
    //   dispatch(collectionWebhooksPush(tok));
    // });
  };
}
