export const COLLECTION_WEBHOOKS_ERROR = 'COLLECTION_WEBHOOKS_ERROR';

export default function collectionWebhooksError(error) {
  return {type: COLLECTION_WEBHOOKS_ERROR, error};
}
