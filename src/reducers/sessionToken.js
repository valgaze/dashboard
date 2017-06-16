import localStorageReducerEnhancer from '../helpers/localstorage-reducer-enhancer/index';
import { SESSION_TOKEN_SET } from '../actions/session-token/set';
import { SESSION_TOKEN_UNSET } from '../actions/session-token/unset';

import { core, accounts, metrics } from '@density-int/client';

const initialState = localStorage.sessionToken !== undefined ? JSON.parse(localStorage.sessionToken) : null;
export function sessionToken(state=initialState, action) {
  switch (action.type) {
  case SESSION_TOKEN_SET:
    return action.token;
  case SESSION_TOKEN_UNSET:
    return null;
  default:
    return state;
  }
}

// When a new session token is injected, update all the api clients with the token.
function updateTokenReducerEnhancer(reducer) {
  return (state, action) => {
    const token = reducer(state, action);
    updateTokensOnApiClients(token);
    return token;
  };
}
function updateTokensOnApiClients(token) {
  core.config({token});
  accounts.config({token});
  metrics.config({token});
}
updateTokensOnApiClients(initialState);

const ered = localStorageReducerEnhancer('sessionToken')(sessionToken);
export default updateTokenReducerEnhancer(ered);
