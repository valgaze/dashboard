import assert from 'assert';
import tokens from './index';

import collectionTokensSet from '../../actions/collection/tokens/set';
import collectionTokensPush from '../../actions/collection/tokens/push';

// Don't worry - these tokens are bogus.
const TOKEN_ONE = 'tok_3wxsa6e8dh5zdnf73ubpnaq37wz2nawcjw8hh5sfawb';
const TOKEN_TWO = 'tok_aus86m8834xef4cqjeye2hzz3u8j5aafucxjgkn695h';

describe('tokens', function() {
  it('should set tokens when given a bunch of tokens', function() {
    const initialState = tokens(undefined, {});

    const result = tokens(initialState, collectionTokensSet([
      {token_type: 'readonly', key: TOKEN_ONE},
      {token_type: 'readwrite', key: TOKEN_TWO},
    ]));

    assert.deepEqual(result, {
      ...initialState,
      loading: false,
      data: [
        {tokenType: 'readonly', key: TOKEN_ONE},
        {tokenType: 'readwrite', key: TOKEN_TWO},
      ],
    });
  });
  it('should push token when given a token update', function() {
    const initialState = tokens(undefined, {});

    // Add a new token.
    const tokenInCollection = tokens(initialState, collectionTokensPush({
      key: 0,
      name: 'foo',
      token_type: 'readonly',
    }));

    // Update token in collection
    const tokenUpdatedInCollection = tokens(tokenInCollection, collectionTokensPush({
      key: 0,
      name: 'new name',
    }));

    assert.deepEqual(tokenUpdatedInCollection, {
      ...initialState,
      data: [{key: 0, name: 'new name', tokenType: 'readonly'}],
    });
  });
  it('should push token when given a new token', function() {
    const initialState = tokens(undefined, {});

    const result = tokens(initialState, collectionTokensPush({
      key: 0,
      name: 'foo',
      tokenType: 'readonly',
    }));

    assert.deepEqual(result, {
      ...initialState,
      data: [{key: 0, name: 'foo', tokenType: 'readonly'}],
    });
  });
});
