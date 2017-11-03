import assert from 'assert';
import featureFlagEnabled from './index';

describe('feature-flag-enabled', function() {
  it('should return true for enabled values', function() {
    assert.equal(featureFlagEnabled('true'), true);
    assert.equal(featureFlagEnabled('True'), true);
    assert.equal(featureFlagEnabled('TRUE'), true);
    assert.equal(featureFlagEnabled('T'), true);
    assert.equal(featureFlagEnabled('t'), true);
    assert.equal(featureFlagEnabled(true), true);
  });
  it('should return false for disabled values', function() {
    assert.equal(featureFlagEnabled('false'), false);
    assert.equal(featureFlagEnabled('False'), false);
    assert.equal(featureFlagEnabled('FALSE'), false);
    assert.equal(featureFlagEnabled('F'), false);
    assert.equal(featureFlagEnabled('f'), false);
    assert.equal(featureFlagEnabled(false), false);
    assert.equal(featureFlagEnabled(undefined), false);
  });
});

