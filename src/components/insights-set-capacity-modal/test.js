import * as React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';

import InsightsSetCapacityModal from './index';

describe('insights set capacity modal', function() {
  it('should let a user enter a capacity', async function() {
    const onSubmit = sinon.spy();
    const onDismiss = sinon.spy();

    // Render the component
    const component = mount(<InsightsSetCapacityModal
      space={{
        id: 'spc_1',
        name: 'My Space',
        currentCount: 2,
        capacity: 5,
        timeZone: 'America/New_York',
      }}
      onSubmit={onSubmit}
      onDismiss={onDismiss}
    />);

    // Type in a capacity into the box
    const input = component.find('.insights-set-capacity-modal-capacity-input input')
    input.simulate('focus');
    input.simulate('change', {target: {value: '123'}});
    input.simulate('blur');

    // Verify that the submit button is not disabled
    assert.equal(component.find('.insights-set-capacity-modal-submit').props().disabled, false)

    // Click submit
    component.find('.insights-set-capacity-modal-submit').simulate('click');

    // Verify that the `onSubmit` callback was called with the new capacity.
    assert.equal(onSubmit.callCount, 1);
    assert.deepEqual(onSubmit.firstCall.args, [123]);
  });
  it('should let a user enter a capacity, but if it is non-numeric, to not accept it', async function() {
    const onSubmit = sinon.spy();
    const onDismiss = sinon.spy();

    // Render the component
    const component = mount(<InsightsSetCapacityModal
      space={{
        id: 'spc_1',
        name: 'My Space',
        currentCount: 2,
        capacity: null,
        timeZone: 'America/New_York',
      }}
      onSubmit={onSubmit}
      onDismiss={onDismiss}
    />);

    // Type in a capacity into the box
    const input = component.find('.insights-set-capacity-modal-capacity-input input')
    input.simulate('focus');
    input.simulate('change', {target: {value: 'abc'}});
    input.simulate('blur');

    // Verify that the submit button is disabled
    assert.equal(component.find('.insights-set-capacity-modal-submit').props().disabled, true);
  });
  it('should let a user enter a capacity, but if it is < 0, do not accept it', async function() {
    const onSubmit = sinon.spy();
    const onDismiss = sinon.spy();

    // Render the component
    const component = mount(<InsightsSetCapacityModal
      space={{
        id: 'spc_1',
        name: 'My Space',
        currentCount: 2,
        capacity: null,
        timeZone: 'America/New_York',
      }}
      onSubmit={onSubmit}
      onDismiss={onDismiss}
    />);

    // Type in a capacity into the box
    const input = component.find('.insights-set-capacity-modal-capacity-input input')
    input.simulate('focus');
    input.simulate('change', {target: {value: '-5'}});
    input.simulate('blur');

    // Verify that the submit button is disabled
    assert.equal(component.find('.insights-set-capacity-modal-submit').props().disabled, true);
  });
});
