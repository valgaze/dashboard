import React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';

import SpaceHierarchySelectBox from './index';

describe('Space hierarchy select box', function() {

  it('should open when focused, and close when an item is clicked', function() {
    const onChange = sinon.spy();

    const component = mount(<SpaceHierarchySelectBox
      choices={[
        {id: 0, parentId: null, spaceType: 'floor', name: 'foo'},
        {id: 1, parentId: null, spaceType: 'floor', name: 'bar'},
        {id: 2, parentId: null, spaceType: 'floor', name: 'baz'},
      ]}
      onChange={onChange}
    />);

    // User focuses the select box, which causes it to open
    const selectBoxValue = component.find('.space-hierarchy-select-box-value');
    selectBoxValue.simulate('focus');

    // Verify that select box opened
    assert.equal(component.state().opened, true);

    // and menu is now visible
    assert.equal(component.find('.space-hierarchy-select-box-menu.opened').length, 1);

    // Unfocus the value and focus the 3rd item in the select box
    const lastItem = component.find('.space-hierarchy-select-box-menu ul li.enabled').at(3);
    selectBoxValue.simulate('blur');
    lastItem.simulate('focus');
    lastItem.simulate('click');

    // Verify that the item was emitted via the `onChange` callback
    assert.equal(onChange.callCount, 1);
    assert.deepEqual(onChange.firstCall.args, [{id: 2, parentId: null, spaceType: 'floor', name: 'baz'}]);
  });
  it('should open when focused, and close when blurred', function() {
    const onChange = sinon.spy();

    const component = mount(<SpaceHierarchySelectBox
      choices={[
        {id: 0, parentId: null, spaceType: 'floor', name: 'foo'},
        {id: 1, parentId: null, spaceType: 'floor', name: 'bar'},
        {id: 2, parentId: null, spaceType: 'floor', name: 'baz'},
      ]}
      onChange={onChange}
    />);

    // User focuses the select box, which causes it to open
    const selectBoxValue = component.find('.space-hierarchy-select-box-value');
    selectBoxValue.simulate('focus');

    // Verify that select box opened
    assert.equal(component.state().opened, true);

    // and menu is now visible
    assert.equal(component.find('.space-hierarchy-select-box-menu.opened').length, 1);

    // User clicks outside the select box, causing the select box value to blur.
    selectBoxValue.simulate('blur');

    // Select box is no longer visible
    assert.equal(component.find('.space-hierarchy-select-box-menu.opened').length, 0);
  });
  it('should open when focused, and let tab to move focus', function() {
    const onChange = sinon.spy();

    const component = mount(<SpaceHierarchySelectBox
      choices={[
        {id: 0, parentId: null, spaceType: 'floor', name: 'foo'},
        {id: 1, parentId: null, spaceType: 'floor', name: 'bar'},
        {id: 2, parentId: null, spaceType: 'floor', name: 'baz'},
      ]}
      onChange={onChange}
    />);

    // Rough implmentation of tab functionality. If something's going to break in this test, it's
    // probably this. :)
    // - Pressing tab increases the selected item's index, ie 0 -> 1 -> 2
    // - Shift tab decreses the selected item's index, ie 2 -> 1 -> 0
    let selectedItemIndex = 0;
    function pressTab() {
      selectedItemIndex += 1;
      const selected = component.find('[tabIndex=0]').at(selectedItemIndex);
      selected.simulate('focus');
      return selected;
    }
    function pressShiftTab() {
      selectedItemIndex -= 1;
      const selected = component.find('[tabIndex=0]').at(selectedItemIndex);
      selected.simulate('focus');
      return selected;
    }

    // User focuses the select box, which causes it to open
    const selectBoxValue = component.find('.space-hierarchy-select-box-value');
    selectBoxValue.simulate('focus');

    // Verify that select box opened
    assert.equal(component.state().opened, true);

    // and menu is now visible
    assert.equal(component.find('.space-hierarchy-select-box-menu.opened').length, 1);

    // User presses tab, which focuses the next element with a `tabindex` of zero
    pressTab(); /* first item */
    pressTab(); /* second item */
    pressTab(); /* third item */
    const selected = pressShiftTab(); /* back to second item */

    // User presses enter to accept selection
    selected.simulate('keydown', {keyCode: 13});

    // onChange should be called with the first item in the select box
    assert.equal(onChange.callCount, 1);
    assert.deepEqual(onChange.firstCall.args, [{id: 0, parentId: null, spaceType: 'floor', name: 'foo'}]);

    // And after selection, the select box should not be open.
    assert.equal(component.state().opened, false);
    assert.equal(component.find('.space-hierarchy-select-box-menu.opened').length, 0);
  });
  it('should open when focused, and close when escape is pressed', function() {
    const onChange = sinon.spy();

    const component = mount(<SpaceHierarchySelectBox
      choices={[
        {id: 0, parentId: null, spaceType: 'floor', name: 'foo'},
        {id: 1, parentId: null, spaceType: 'floor', name: 'bar'},
        {id: 2, parentId: null, spaceType: 'floor', name: 'baz'},
      ]}
      onChange={onChange}
    />);

    // User focuses the select box, which causes it to open
    const selectBoxValue = component.find('.space-hierarchy-select-box-value');
    selectBoxValue.simulate('focus');

    // Verify that select box opened
    assert.equal(component.state().opened, true);

    // and menu is now visible
    assert.equal(component.find('.space-hierarchy-select-box-menu.opened').length, 1);

    // User presses escape to close select box
    // Since this functionality calls e.target.blur(), we need to mock its behavior
    selectBoxValue.simulate('keydown', {
      keyCode: 27,
      target: { blur: () => component.instance().onMenuBlur() }
    });

    // And after, the select box should not be open.
    assert.equal(component.state().opened, false);
    assert.equal(component.find('.space-hierarchy-select-box-menu.opened').length, 0);
  });
});
