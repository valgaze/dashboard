import assert from 'assert';
import activeModal from './index';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';

describe('active-modal', function() {
  it('shows a modal', function() {
    const result = activeModal(null, showModal('foo'));
    assert.equal(result.name, 'foo');
  });
  it('shows a modal with data', function() {
    const result = activeModal(null, showModal('foo', {hello: 'world'}));
    assert.deepEqual(result, {name: 'foo', data: {hello: 'world'}});
  });
  it('hides a modal', function() {
    const result = activeModal('foo', hideModal());
    assert.equal(result.name, null);
  });
});
