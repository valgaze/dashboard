import collectionTokensPush from './push';
import { accounts } from '@density-int/client';
import collectionTokensError from './error';

export const COLLECTION_TOKENS_UPDATE = 'COLLECTION_TOKENS_UPDATE';

export default function collectionTokensUpdate(token) {
  return async dispatch => {
    dispatch({ type: COLLECTION_TOKENS_UPDATE, token });

    try {
      const response = await accounts.tokens.update({
        name: token.name,
        description: token.description,
        token_type: token.tokenType,
      });
      dispatch(collectionTokensPush(response));
      return response;
    } catch (err) {
      dispatch(collectionTokensError(err));
      if (process.env.NODE_ENV !== 'test') { throw err; }
    }
  };
}
