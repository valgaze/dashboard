import assert from 'assert';
import spaces from './index';

import collectionSpacesSet from '../../actions/collection/spaces/set';
import collectionSpacesPush from '../../actions/collection/spaces/push';
import collectionSpacesFilter from '../../actions/collection/spaces/filter';
import collectionSpacesDelete from '../../actions/collection/spaces/delete';
import collectionSpacesError from '../../actions/collection/spaces/error';
import { COLLECTION_SPACES_UPDATE } from '../../actions/collection/spaces/update'; 

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
      loading: false,
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
      loading: false,
      data: [{id: 0, name: 'foo', currentCount: 5}],
    });
  });
  it('should filter space collection when given a filter', function() {
    const initialState = spaces(undefined, {});

    const result = spaces(initialState, collectionSpacesFilter('search', 'foo'));

    assert.deepEqual(result, {
      ...initialState,
      filters: {...initialState.filters, search: 'foo'},
    });
  });
  it('should delete a space from the spaces collection', function() {
    const initialState = spaces(undefined, {});

    const SPACE = {
      id: 0,
      name: 'foo',
      current_count: 5,
    };

    // Add a space, then delete a space
    const spaceInCollection = spaces(initialState, collectionSpacesPush(SPACE));
    const result = spaces(spaceInCollection, collectionSpacesDelete(SPACE));

    // Initial state should then match final state.
    assert.deepEqual(result, {...initialState, loading: false});
  });
  it('should set an error when an error happens', function() {
    const initialState = spaces(undefined, {});

    // Add a space, then delete a space
    const errorState = spaces(initialState, collectionSpacesError('boom!'));

    // Initial state should then match final state.
    assert.deepEqual(errorState, {...initialState, error: 'boom!', loading: false});
  });
  it('should clear an error when an async operation starts.', function() {
    const initialState = spaces(undefined, {});

    // Add an error to the state.
    const errorState = spaces(initialState, collectionSpacesError('boom!'));

    // Then, update a space.
    const state = spaces(errorState, {type: COLLECTION_SPACES_UPDATE});

    // Initial state should then have error: null
    assert.deepEqual(state, {...initialState, error: null, loading: true});
  });
});
