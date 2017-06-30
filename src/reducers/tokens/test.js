import assert from 'assert';
import tokens from './index';

import collectionTokensSet from '../../actions/collection/tokens/set';

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
});
