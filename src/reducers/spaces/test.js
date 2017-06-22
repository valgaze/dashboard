import assert from 'assert';
import spaces from './index';

import collectionSpacesSet from '../../actions/collection/spaces-set';

describe('spaces', function() {
  it('should set spaces when given a bunch of spaces', function() {
    const initialState = spaces(undefined, {});

    const result = spaces(initialState, collectionSpacesSet([
      {id: 0, name: 'foo', current_count: 5},
      {id: 1, name: 'bar', current_count: 8},
    ]));

    assert.deepEqual(result, {
      ...initialState,
      loading: false,
      data: [
        {id: 0, name: 'foo', currentCount: 5},
        {id: 1, name: 'bar', currentCount: 8},
      ],
    });
  });
});
