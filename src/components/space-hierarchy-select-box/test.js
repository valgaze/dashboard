import React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';
import lolex from 'lolex';

import SpaceHierarchySelectBox from './index';

describe('Space hierarchy select box', function() {
  let clock;
  beforeEach(() => { clock = lolex.install(); });
  afterEach(() => clock.uninstall());

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

    // Unfocus the value and focus the last item in the select box
    const lastItem = component.find('.space-hierarchy-select-box-menu ul li').last();
    selectBoxValue.simulate('blur');
    lastItem.simulate('focus');
    lastItem.simulate('mouseup');

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

    // Wait 100 milliseconds, so that the selectbox can update itself.
    clock.tick(100);

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
    const selected = pressShiftTab(); /* back to first item */

    // User presses enter to accept selection
    selected.simulate('keyup', {keyCode: 13});

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
    selectBoxValue.simulate('keyup', {keyCode: 27});

    // Wait 100 milliseconds, so that the selectbox can update itself.
    clock.tick(100);

    // And after, the select box should not be open.
    assert.equal(component.state().opened, false);
    assert.equal(component.find('.space-hierarchy-select-box-menu.opened').length, 0);
  });
});


function calculateItemRenderOrder(choices) {
  // Find everything with a `parentId` of `null` - they should go at the top of the list.
  const topLevelItems = choices.filter(i => i.parentId === null);

  function insertLowerItems(topLevelItems, depth=0) {
    return topLevelItems.reduce((acc, topLevelItem) => {
      // Find all items that should be rendered under the given `topLevelItem`
      const itemsUnderThisTopLevelItem = choices.filter(i => i.parentId === topLevelItem.id);

      return [
        ...acc,

        // The item to add to the list
        {depth, item: topLevelItem},

        // Add all children under this item (nd their children, etc) below this item.
        ...insertLowerItems(itemsUnderThisTopLevelItem, depth+1),
      ];
    }, []);
  }
  return insertLowerItems(topLevelItems);
}

describe('render order', function() {
  it('should work', function() {
    const choices = [
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
    ];


    process.stdout.write('\n');
    const results = calculateItemRenderOrder(choices);
    results.forEach(i => {
      let spacing = '';
      for (let j = 0; j < i.depth; j++) {
        spacing += '  ';
      }
      process.stdout.write(spacing+i.item.name+'\n');
    });
  });
});
