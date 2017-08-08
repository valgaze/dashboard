export const COLLECTION_TOKENS_ERROR = 'COLLECTION_TOKENS_ERROR';

export default function collectionTokensError(error) {
  return {type: COLLECTION_TOKENS_ERROR, error};
}
