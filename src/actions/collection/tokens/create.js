import collectionTokensPush from './push';
import { accounts } from '@density-int/client';

export const COLLECTION_TOKENS_CREATE = 'COLLECTION_TOKENS_CREATE';

export default function collectionTokensCreate(token) {
  return dispatch => {
    dispatch({ type: COLLECTION_TOKENS_CREATE, token });

    return accounts.tokens.create({
      name: token.name,
      description: token.description,
      token_type: token.tokenType,
    }).then(tok => {
      dispatch(collectionTokensPush(tok));
    });
  };
}
