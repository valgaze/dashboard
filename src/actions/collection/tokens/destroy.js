import collectionTokensDelete from './delete';
import { accounts } from '@density-int/client';

export const COLLECTION_TOKENS_DESTROY = 'COLLECTION_TOKENS_DESTROY';

export default function collectionTokensDestroy(item) {
  return dispatch => {
    dispatch({ type: COLLECTION_TOKENS_DESTROY, item });

    return accounts.tokens.delete({key: item.key}).then(() => {
      dispatch(collectionTokensDelete(item));
    });
  };
}
