import localStorageReducerEnhancer from '../../helpers/localstorage-reducer-enhancer/index';
import { SESSION_TOKEN_SET } from '../../actions/session-token/set';
import { SESSION_TOKEN_UNSET } from '../../actions/session-token/unset';

import { core, accounts, telemetry } from '../../client';

import logger from '../../helpers/logger/index';

const localStorage = window.localStorage || global.localStorage || {};

const setServiceLocationLogger = logger('density:set-service-locations');

// The initial state of the reducer is either the contents of the localStorage key `sessionToken` or
// null if no user is logged in.
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

function sliceOffEndOfToken(token) {
  if (typeof token === 'undefined' || !token) {
    return null;
  } else {
    return token.slice(-8);
  }
}

// This function serves as a way of updating every service or concept in the application that
// requires access to a token. This includes all the api clients and the websockets event source.
function updateTokensOnApiClients(token) {
  const last8CharsOfOldToken = sliceOffEndOfToken(core.config().token);
  const last8CharsOfNewToken = sliceOffEndOfToken(token);

  core.config({token});
  accounts.config({token});
  telemetry.config({token});

  // Don't log unless the token has changed.
  if (last8CharsOfOldToken === last8CharsOfNewToken) { return; }
  setServiceLocationLogger({
    type: 'SESSION_TOKEN_CHANGED',
    new_token_last_8: last8CharsOfNewToken,
    old_token_last_8: last8CharsOfOldToken,
  });
}
updateTokensOnApiClients(initialState);

// Thinking "What's a reducer enhancer?" - here's a link to some redux docs:
// https://github.com/reactjs/redux/blob/master/docs/recipes/ImplementingUndoHistory.md#meet-reducer-enhancers
const ered = localStorageReducerEnhancer('sessionToken')(sessionToken);
export default updateTokenReducerEnhancer(ered);
