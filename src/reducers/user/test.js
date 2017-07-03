import assert from 'assert';
import user from './index';

import userSet from '../../actions/user/set';

describe('user', function() {
  it('should update the user inside', function() {
    const output = user(null, userSet({email: 'test@density.io'}));
    assert.deepEqual(output, {email: 'test@density.io'});
  });
});
