import React from 'react';
import classnames from 'classnames';

import { IconChevronDown } from '@density/ui-icons';

// Used in `calculateItemRenderOrder` in `SpaceHierarchySelectBox` below.
function addZeroItemBeforeFirstSpaceOfType(items, zeroItem, spaceType) {
  const firstSpaceOfTypeIndex = items.findIndex(i => {
    return (
      i.depth === 0 &&
      i.choice.spaceType === spaceType
    );
  });
  if (firstSpaceOfTypeIndex === -1) {
    return [...items, zeroItem];
  }

  return [
    ...items.slice(0, firstSpaceOfTypeIndex),
    zeroItem,
    ...items.slice(firstSpaceOfTypeIndex),
  ];
}

const SPACE_TYPE_SORT_ORDER = [
  'campus',
  'building',
  'floor',
  'space',
];

export default class SpaceHierarchySelectBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: false,
    };

    this.focusedChoice = null;

    // Holds a reference to each dom node in the choice list so that they can be programatically
    // blurred when the box is closed.
    this.choiceNodes = {
      /* 'spc_xxx': <domnode>, */
    };

    // Called when the user focuses either the value or an item in the menu part of the box.
    this.onMenuFocus = choice => {
      this.setState({opened: true});
      this.focusedChoice = choice;
    };

    // Called when the user blurs either the value or an item in the menu part of the box.
    this.onMenuBlur = () => {
      this.setState({opened: false});
    };

    // Called when the user selects an item within the menu of the select box.
    this.onMenuItemSelected = choice => {
      this.setState({opened: false}, () => {

        // Defocus selected item. If this is not done, then clicking on the "value" part of the box
        // again will cause this item to blur, which causes the menu part of the box to hide and
        // unhide in quick succession.
        this.choiceNodes[choice.id].blur();

        if (this.props.onChange) {
          this.props.onChange(choice.id === 'default' ? null : choice);
        }
      });
    }
  }

  calculateItemRenderOrder() {
    const { choices } = this.props;

    // Find everything with a `parentId` of `null` - they should go at the top of the list.
    const topLevelItems = choices.filter(i => i.parentId === null);

    function insertLowerItems(topLevelItems, depth=0) {
      return topLevelItems.sort((a, b) => {
        return SPACE_TYPE_SORT_ORDER.indexOf(a.spaceType) - SPACE_TYPE_SORT_ORDER.indexOf(b.spaceType);
      }).reduce((acc, topLevelItem) => {
        // Find all items that should be rendered under the given `topLevelItem`
        const itemsUnderThisTopLevelItem = choices.filter(i => i.parentId === topLevelItem.id);

        return [
          ...acc,

          // The item to add to the list
          {depth, choice: topLevelItem},

          // Add all children under this item (and their children, etc) below this item.
          ...insertLowerItems(itemsUnderThisTopLevelItem, depth+1),
        ];
      }, []);
    }

    // Generate the tree from the lost of top level items.
    let lowerItems = insertLowerItems(topLevelItems);

    // Insert the "zero items" - the items that indicate that there is zero of a particular class of
    // items such as floors, buildings, or campuses.
    if (choices.filter(i => i.spaceType === 'floor').length === 0) {
      lowerItems = addZeroItemBeforeFirstSpaceOfType(lowerItems, {
        depth: 0,
        choice: {
          id: 'zerofloors',
          disabled: true,
          name: 'Floor',
          spaceType: 'floor',
        },
      }, 'space');
    }

    if (choices.filter(i => i.spaceType === 'building').length === 0) {
      lowerItems = addZeroItemBeforeFirstSpaceOfType(lowerItems, {
        depth: 0,
        choice: {
          id: 'zerobuildins',
          disabled: true,
          name: 'Building',
          spaceType: 'building',
        },
      }, 'floor');
    }

    if (choices.filter(i => i.spaceType === 'campus').length === 0) {
      lowerItems = addZeroItemBeforeFirstSpaceOfType(lowerItems, {
        depth: 0,
        choice: {
          id: 'zerocampuses',
          disabled: true,
          name: 'Campus',
          spaceType: 'campus',
        },
      }, 'building');
    }

    return lowerItems;
  }

  render() {
    const { value, disabled } = this.props;
    const { opened } = this.state;

    return <div className="space-hierarchy-select-box">
      <div
        className={classnames(`space-hierarchy-select-box-value`, {disabled, opened})}
        aria-label="Space Hierarchy"

        onFocus={() => this.onMenuFocus(null)}
        onBlur={this.onMenuBlur}
        onKeyDown={e => {
          if (e.keyCode === 27 /* escape */) {
             this.selectBoxValueRef.blur();
          }
        }}
        onMouseDown={e => {
          if (this.state.opened) {
             e.preventDefault();
             this.selectBoxValueRef.blur();
          }
        }}

        aria-expanded={opened}
        aria-autocomplete="list"
        tabIndex="0"
        ref={r => { this.selectBoxValueRef = r; }}
      >
        {value ? <span>
          {value.name}
          <span className="space-hierarchy-select-box-item-highlight">
            {value.spaceType ? `${value.spaceType[0].toUpperCase()}${value.spaceType.slice(1)}` : ''}
          </span>
        </span> : <span>
          All spaces
          <span className="space-hierarchy-select-box-item-highlight">Default</span>
        </span>}
        <div className="input-box-caret">
          <IconChevronDown color="primary" width={12} height={12} />
        </div>
      </div>

      <div
        role="listbox"
        className={classnames('space-hierarchy-select-box-menu', {opened})}
      >
        <ul>
          {[
            {
              depth: 0,
              choice: {
                id: 'default',
                name: 'All spaces',
                spaceType: 'default',
              },
            },
            ...this.calculateItemRenderOrder(),
          ].map(({depth, choice}) => {
            return <li
              key={choice.id}
              ref={r => { this.choiceNodes[choice.id] = r; }}

              className={classnames('space-hierarchy-select-box-menu-item', {
                disabled: choice.disabled,
                enabled: !choice.disabled,
              })}
              style={{paddingLeft: 15 + depth * 10}}

              id={`space-hierarchy-${choice.id.toString().replace(' ', '-')}`}
              role="option"
              aria-selected={value && value.id === choice.id}
              tabIndex={!choice.disabled && opened ? 0 : -1}

              onFocus={() => this.onMenuFocus(choice)}
              onBlur={this.onMenuBlur}
              onKeyDown={e => {
                if (e.keyCode === 13 /* enter */) {
                  this.onMenuItemSelected(choice);
                } else if (e.keyCode === 27 /* escape */) {
                  this.selectBoxValueRef.blur();
                }
              }}
              onMouseDown={e => choice.disabled && e.preventDefault()}
              onClick={() => choice.disabled || this.onMenuItemSelected(choice)}
            >
              {choice.name}
              <span className="space-hierarchy-select-box-item-highlight">
                {(() => {
                  if (choice.disabled) {
                    return '(0)';
                  } else {
                    return choice.spaceType ? `${choice.spaceType[0].toUpperCase()}${choice.spaceType.slice(1)}` : '';
                  }
                })()}
              </span>
            </li>;
          })}
        </ul>
      </div>
    </div>;
  }
}
