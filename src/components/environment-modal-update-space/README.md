# EnvironmentModalUpdateSpace

A component used to view details about a space, and allow the user to switch into edit mode to
modify details such as the name and time zone.

The normal view presents itself as a popover, with all fields disabled. When the user clicks the
edit a button, a modal appears with the edit view, and all fields are un-disabled.

## Component Props
- `initialSpace: DensitySpace` - The space to update.
- `onSubmit: ({name, description, timezone, dailyReset}) => any` - A callback that is called with the updated space.
- `onDismiss: () => any` - A callback that is called when the modal is dismissed.
- `doorways: [DensityDoorway]` - A list of doorways to render within the card. These are read only.
- `popoverPositionTarget: Element`: A passed element to make the popover display relative to when
  its displayed. If not specified, then the little arrow on the top of the popover will be weirdly
  placed. Internally this is passed to a Density UI `Popover`'s `target` prop.
