import { accounts } from '../../client';
import collectionTokensSet from '../collection/tokens/set';
import collectionTokensError from '../collection/tokens/error';
import errorHelper from '../../helpers/error-helper/index';

export const ROUTE_TRANSITION_DEV_TOKEN_LIST = 'ROUTE_TRANSITION_DEV_TOKEN_LIST';

export default function routeTransitionDevTokenList() {
  return dispatch => {
    dispatch({ type: ROUTE_TRANSITION_DEV_TOKEN_LIST });

    // Fetch a list of all tokens.
    return errorHelper({
      try: () => accounts.tokens.list(),
      catch: error => {
        dispatch(collectionTokensError(error));
      },
      else: async request => {
        const tokens = await request;
        dispatch(collectionTokensSet(tokens));
      },
    });
  };
}
