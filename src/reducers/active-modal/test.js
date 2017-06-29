import assert from 'assert';
import activeModal from './index';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';

describe('active-modal', function() {
  it('shows a modal', function() {
    const result = activeModal(null, showModal('foo'));
    assert.equal(result, 'foo');
  });
  it('hides a modal', function() {
    const result = activeModal('foo', hideModal());
    assert.equal(result, null);
  });
});
