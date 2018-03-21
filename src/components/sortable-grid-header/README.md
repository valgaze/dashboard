# SortableGridHeader

This component implements the header for a sortable table, where each row has a number of different
cells. Each label allows the user to sort the column ascending or descending. This is a stateless
component that only implements the header, the body part of the table at the moment is drawn by the
component.

This component is going to start out simple but depending on how this ends up being used this could
get incredibly complex. So, for now I'm going to take some shortcuts that mean that this component
will be less complex but won't be as flexible.

## `SortableGridHeader` Component Props
- `children: ReactElement` - all `SortableGridHeaderItem`s to render within the
  `SortableGridHeader`.

## `SortableGridHeaderItem` Component Props
- `width: Number` - an integer that is added to the `flex` property on the header, which means that a
  larger number will produce a larger cell. For example, `[{width: 1, ...}, {width: 2}]` would
  produce a row with two headers, where the first takes up 1/3 of the space and the second takes
  up 2/3 of the space.
- `children: ReactElement` - the label for the column.
- `active: Boolean` - indicates whether the given column is active (ie, is the primary
  member used for sorting)
- `sort: SORT_ASC | SORT_DESC` - an optional value used to specify the sorting direction of the
  colum that has `active` set to `true`.
