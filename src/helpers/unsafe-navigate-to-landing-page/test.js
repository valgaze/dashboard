
import assert from 'assert';
import unsafeNavigateToLandingPage from './index';

describe('unsafe-navigate-to-landing-page', function() {
  it('should attempt to navigate', function() {
    assert.equal(unsafeNavigateToLandingPage(), undefined);
  });
});

