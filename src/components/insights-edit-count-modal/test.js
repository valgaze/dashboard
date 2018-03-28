import * as React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';

import { Provider } from 'react-redux';
import storeFactory from '../../store';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';

import SpaceUpdateModal from './index';

describe('Space update modal', function() {
  it('should render a space update modal (smoke test)', function() {
    const component = mount(<SpaceUpdateModal
      space={{id: 'spc_1', name: 'Foo', currentCount: 5, capacity: 10}}
      onSubmit={count => false}
      onDismiss={() => false}
    />);

    // Should render two tokens
    assert.equal(component.find('.insights-edit-count-modal').length, 1);
  });

  it('should have proper ui interactions and create a reset', async function() {
    // Mount the component.
    const onSubmit = sinon.spy();
    const onDismiss = sinon.spy();
    const component = mount(<SpaceUpdateModal
      space={{id: 'spc_1', name: 'Foo', currentCount: 5, capacity: 10}}
      onSubmit={onSubmit}
      onDismiss={onDismiss}
    />);

    // The current count is set initially to the value passed into the component.
    let value = component.find('.insights-edit-count-modal-count-picker-label input').prop('value');
    assert.equal(value, '5');

    // Click the add button
    component.find('.insights-edit-count-modal-count-button.add').simulate('click');

    // The current count is one larger.
    value = component.find('.insights-edit-count-modal-count-picker-label input').prop('value');
    assert.equal(value, '6');

    // Click the subtract button, twice
    component.find('.insights-edit-count-modal-count-button.subtract').simulate('click');
    component.find('.insights-edit-count-modal-count-button.subtract').simulate('click');

    // The current count is two smaller.
    value = component.find('.insights-edit-count-modal-count-picker-label input').prop('value');
    assert.equal(value, '4');

    // Click 'reset to zero' link
    component.find('.insights-edit-count-modal-reset-count').simulate('click');

    // Count is then internally set to zero
    value = component.find('.insights-edit-count-modal-count-picker-label input').prop('value');
    assert.equal(value, '0');

    // Type a count to reset to into the textbox
    component.find('.insights-edit-count-modal-count-picker-label input').simulate('change', {target: {value: '100'}});
    component.find('.insights-edit-count-modal-count-picker-label input').simulate('blur');

    // Verify the count was set to that number
    value = component.find('.insights-edit-count-modal-count-picker-label input').prop('value');
    assert.equal(value, '100');

    // Type a negative number into the textbox
    component.find('.insights-edit-count-modal-count-picker-label input').simulate('change', {target: {value: '-100'}});
    component.find('.insights-edit-count-modal-count-picker-label input').simulate('blur');

    // Verify the count was set to zero
    value = component.find('.insights-edit-count-modal-count-picker-label input').prop('value');
    assert.equal(value, '0');

    // Type a floating point number into the box
    component.find('.insights-edit-count-modal-count-picker-label input').simulate('change', {target: {value: '10.2'}});
    component.find('.insights-edit-count-modal-count-picker-label input').simulate('blur');

    // Verify the count was set to ten
    value = component.find('.insights-edit-count-modal-count-picker-label input').prop('value');
    assert.equal(value, '10');

    // Type a text string into the box (this shouldn't happen because it's an input type number, but
    // it handles the case anyway)
    component.find('.insights-edit-count-modal-count-picker-label input').simulate('change', {target: {value: 'abc'}});
    component.find('.insights-edit-count-modal-count-picker-label input').simulate('blur');

    // Verify the count was unchanged
    value = component.find('.insights-edit-count-modal-count-picker-label input').prop('value');
    assert.equal(value, '10');

    // Set the count to a known state
    component.setState({count: 10, textCount: false});

    // Click the button in the modal, which should call `onSubmit` with the count
    component.find('.insights-edit-count-modal-submit').simulate('click');

    // Ensure that the correct count was passed through.
    assert.equal(onSubmit.firstCall.args[0], 10);
  });
});
