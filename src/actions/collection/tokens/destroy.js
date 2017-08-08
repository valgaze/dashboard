import collectionTokensDelete from './delete';
import { accounts } from '@density-int/client';
import collectionTokensError from './error';

export const COLLECTION_TOKENS_DESTROY = 'COLLECTION_TOKENS_DESTROY';

export default function collectionTokensDestroy(item) {
  return async dispatch => {
    dispatch({ type: COLLECTION_TOKENS_DESTROY, item });

    try {
      const response = await accounts.tokens.delete({key: item.key});
      dispatch(collectionTokensDelete(item));
      return response;
    } catch (err) {
      dispatch(collectionTokensError(err));
      if (process.env.NODE_ENV !== 'test') { throw err; }
    }
  };
}
