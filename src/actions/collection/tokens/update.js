import collectionTokensPush from './push';
// import { accounts } from '@density-int/client';

export const COLLECTION_TOKENS_UPDATE = 'COLLECTION_TOKENS_UPDATE';

export default function collectionTokensUpdate(token) {
  return dispatch => {
    dispatch({ type: COLLECTION_TOKENS_UPDATE, token });
    dispatch(collectionTokensPush(token));

    // TODO: can't update without name and description fields
    // return accounts.tokens.update({
    //   name: token.name,
    //   description: token.desc,
    //   token_type: token.tokenType,
    // }).then(tok => {
    //   dispatch(collectionTokensPush(tok));
    // });
  };
}
