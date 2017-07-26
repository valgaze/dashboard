import { accounts } from '@density-int/client';
import collectionTokensSet from '../collection/tokens/set';

export const ROUTE_TRANSITION_DEV_TOKEN_LIST = 'ROUTE_TRANSITION_DEV_TOKEN_LIST';

export default function routeTransitionDevTokenList() {
  return dispatch => {
    dispatch({ type: ROUTE_TRANSITION_DEV_TOKEN_LIST });

    // Fetch a list of all tokens.
    return accounts.tokens.list().then(tokens => {
      dispatch(collectionTokensSet(tokens));
    });
  };
}
