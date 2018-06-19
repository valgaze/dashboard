import React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';

import SpaceHierarchySelectBox from './index';

describe('Space hierarchy select box', function() {

  describe('calculateItemRenderOrder', function() {
    it('should render a bunch of spaces in the right order and hierarchy', function() {
      const component = mount(<SpaceHierarchySelectBox
        choices={[
          {name: 'Food', id: 0, parentId: null, spaceType: 'building'},
            {name: 'Pickled things', id: 1, parentId: 0, spaceType: 'floor'},
              {name: 'Pickles', id: 2, parentId: 1, spaceType: 'space'},
              {name: 'Sour crout', id: 3, parentId: 1, spaceType: 'space'},
              {name: 'Relish', id: 4, parentId: 1, spaceType: 'space'},
            {name: 'Fruits', id: 5, parentId: 0, spaceType: 'floor'},
              {name: 'Apples', id: 6, parentId: 5, spaceType: 'space'},
                {name: 'Macintosh', id: 7, parentId: 6, spaceType: 'space'},
                {name: 'Granny Smith', id: 8, parentId: 6, spaceType: 'space'},
                {name: 'Gala', id: 9, parentId: 6, spaceType: 'space'},
              {name: 'Banannas', id: 10, parentId: 5, spaceType: 'space'},
              {name: 'Peaches', id: 11, parentId: 5, spaceType: 'space'},
            {name: 'Calamari', id: 12, parentId: 0, spaceType: 'floor'},
        ]}
      />);

      // Ensure the return value of `calculateItemRenderOrder` is what is expected
      const items = component.instance().calculateItemRenderOrder();
      assert.deepEqual(items, [
        {
          depth: 0,
          choice: {
            id: 'zerocampuses',
            disabled: true,
            name: 'Campus',
            spaceType: 'campus',
          },
        },

        { depth: 0, choice: { name: 'Food', spaceType: 'building', id: 0, parentId: null } },
        { depth: 1, choice: { name: 'Pickled things', spaceType: 'floor', id: 1, parentId: 0 } },
        { depth: 2, choice: { name: 'Pickles', spaceType: 'space', id: 2, parentId: 1 } },
        { depth: 2, choice: { name: 'Sour crout', spaceType: 'space', id: 3, parentId: 1 } },
        { depth: 2, choice: { name: 'Relish', id: 4, spaceType: 'space', parentId: 1 } },
        { depth: 1, choice: { name: 'Fruits', id: 5, spaceType: 'floor', parentId: 0 } },
        { depth: 2, choice: { name: 'Apples', id: 6, spaceType: 'space', parentId: 5 } },
        { depth: 3, choice: { name: 'Macintosh', id: 7, spaceType: 'space', parentId: 6 } },
        { depth: 3, choice: { name: 'Granny Smith', id: 8, spaceType: 'space', parentId: 6 } },
        { depth: 3, choice: { name: 'Gala', id: 9, spaceType: 'space', parentId: 6 } },
        { depth: 2, choice: { name: 'Banannas', id: 10, spaceType: 'space', parentId: 5 } },
        { depth: 2, choice: { name: 'Peaches', id: 11, spaceType: 'space', parentId: 5 } },
        { depth: 1, choice: { name: 'Calamari', id: 12, spaceType: 'floor', parentId: 0 } },
      ]);
    });
    it('should render the zero items when there are no campuses, buildings, or floors', function() {
      const component = mount(<SpaceHierarchySelectBox choices={[]} />);

      // Ensure the return value of `calculateItemRenderOrder` is what is expected
      const items = component.instance().calculateItemRenderOrder();
      assert.deepEqual(items, [
        {
          depth: 0,
          choice: {
            id: 'zerocampuses',
            disabled: true,
            name: 'Campus',
            spaceType: 'campus',
          },
        },
        {
          depth: 0,
          choice: {
            id: 'zerobuildings',
            disabled: true,
            name: 'Building',
            spaceType: 'building',
          },
        },
        {
          depth: 0,
          choice: {
            id: 'zerofloors',
            disabled: true,
            name: 'Floor',
            spaceType: 'floor',
          },
        },
      ]);
    });
  });

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
  it('should open when focused, and close when escape is pressed with focus on the value', function() {
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
    selectBoxValue.simulate('keydown', { keyCode: 27 });

    // And after, the select box should not be open.
    assert.equal(component.state().opened, false);
    assert.equal(component.find('.space-hierarchy-select-box-menu.opened').length, 0);
  });
  it('should open when focused, and close when escape is pressed with focus on an item', function() {
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

    // User focuses an item in the select box
    component.find('.space-hierarchy-select-box-menu-item').first().simulate('focus');

    // User presses escape to close select box
    selectBoxValue.simulate('keydown', { keyCode: 27 });

    // And after, the select box should not be open.
    assert.equal(component.state().opened, false);
    assert.equal(component.find('.space-hierarchy-select-box-menu.opened').length, 0);
  });
});
