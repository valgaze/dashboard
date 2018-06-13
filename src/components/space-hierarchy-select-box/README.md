# SpaceHierarchySelectBox

A component that allows users to select a given node in the space hierarchy - ie, a floor, building,
or space. It's used on the insights ans love pages to provide a mechanism to filter spaces. This
component is stateless.

## Component Props
- `choices: [Space]` - A list of spaces to show in the space hierarchy.
- `value: {id: any, value: any} | any` - The currently selected item in the space hierarchy box.
  This parameter either accepts an item in the `choices` prop (ie, such that
  `choices.indexOf(value)` isn't -1) or an `id` from any item in the `choices` prop. If null or an
  invalid value, the selectbox renders without an item in the top part of the box.
- `disabled: bool` - Should the space hierarchy box render in a disabled state? Defaults to `false`.
- `onChange: (Space) => any` - When the user selects a space in the hierarchy, this callback is
  called with the selected space. Typically, this value would be stored and fed back into the
  `value` prop of this component to make it interactive.
