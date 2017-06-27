# EnvironmentSpaceItem

A space that accepts draggable doorways within, to be used on the environment page in the space
list.

## Component Props
- `space: DensitySpace` - A space from the spaces collection in the store.
- `doorways: [DensityDoorway]` - An array of doorways from within the doorway collection to display
  within the space.
- `onDoorwayDropped: (space) => any` - A callback that is called when the user drops a doorway onto
  a space.
