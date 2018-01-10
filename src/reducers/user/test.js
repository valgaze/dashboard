import assert from 'assert';
import user from './index';

import userSet from '../../actions/user/set';
import userPush from '../../actions/user/push';

describe('user', function() {
  it('should fully update the user inside', function() {
    const output = user(null, userSet({email: 'test@density.io'}));
    assert.deepEqual(output.data, {email: 'test@density.io'});
  });
  it('should apply a single field update to a user', function() {
    const output = user({user: {foo: 'bar'}}, userPush({email: 'test@density.io'}));
    assert.deepEqual(output.data, {foo: 'bar', email: 'test@density.io'});
  });
});
