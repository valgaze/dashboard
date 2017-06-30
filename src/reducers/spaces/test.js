import assert from 'assert';
import spaces from './index';

import collectionSpacesSet from '../../actions/collection/spaces-set';
import collectionSpacesPush from '../../actions/collection/spaces-push';

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
  it('should push space when given a space update', function() {
    const initialState = spaces(undefined, {});

    // Add a new space.
    const spaceInCollection = spaces(initialState, collectionSpacesPush({
      id: 0,
      name: 'foo',
      current_count: 4,
    }));

    // Update space in collection
    const spaceUpdatedInCollection = spaces(spaceInCollection, collectionSpacesPush({
      id: 0,
      name: 'new name',
    }));

    assert.deepEqual(spaceUpdatedInCollection, {
      ...initialState,
      data: [{id: 0, name: 'new name', currentCount: 4}],
    });
  });
  it('should push space when given a new space', function() {
    const initialState = spaces(undefined, {});

    const result = spaces(initialState, collectionSpacesPush({
      id: 0,
      name: 'foo',
      current_count: 5,
    }));

    assert.deepEqual(result, {
      ...initialState,
      data: [{id: 0, name: 'foo', currentCount: 5}],
    });
  });
});
