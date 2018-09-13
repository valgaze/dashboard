import assert from 'assert';
import timeSegmentGroups from './index';

import set from '../../actions/collection/time-segment-groups/set';
import error from '../../actions/collection/time-segment-groups/error';

const INITIAL_STATE = timeSegmentGroups(undefined, {});

describe('time-segment-groups', function() {
  it('should set time segments when given a new list of them', () => {
    const results = timeSegmentGroups(INITIAL_STATE, set([
      { id: 'tsg_1' },
      { id: 'tsg_2' },
      { id: 'tsg_3' },
    ]));
    assert.deepEqual(results.data, [
      { id: 'tsg_1' },
      { id: 'tsg_2' },
      { id: 'tsg_3' },
    ]);
    assert.equal(results.loading, false);
    assert.equal(results.error, null);
  });
  it('should error when given an error', () => {
    const results = timeSegmentGroups(INITIAL_STATE, error(new Error('Boom')));
    assert.deepEqual(results.error, 'Error: Boom');
  });
});

