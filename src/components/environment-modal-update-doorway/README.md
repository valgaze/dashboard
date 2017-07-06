# EnvironmentModalUpdateDoorway

A component used to view details about a doorway, and allow the user to switch into edit mode to
modify details such as the name and description.

The normal view presents itself as a popover, with all fields disabled. When the user clicks the
edit a button, a modal appears with the edit view, and all fields are un-disabled.

## Component Props
- `initialDoorway: DensityDoorway` - The doorway to update.
- `onSubmit: ({name: string, desc: string}) => any` - A callback that is called with the updated doorway.
- `onDismiss: () => any` - A callback that is called when the modal is dismissed.
- `popoverPositionTarget: Element`: A passed element to make the popover display relative to when
  its displayed. If not specified, then the little arrow on the top of the popover will be weirdly
  placed. Internally this is passed to a Density UI `Popover`'s `target` prop.
