import collectionTokensPush from './push';
import { accounts } from '@density-int/client';

export const COLLECTION_TOKENS_UPDATE = 'COLLECTION_TOKENS_UPDATE';

export default function collectionTokensUpdate(token) {
  return dispatch => {
    dispatch({ type: COLLECTION_TOKENS_UPDATE, token });

    return accounts.tokens.update({
      name: token.name,
      description: token.description,
      token_type: token.tokenType,
    }).then(tok => {
      dispatch(collectionTokensPush(tok));
    });
  };
}
