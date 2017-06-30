# EnvironmentModalUpdateDoorway

A modal shown on the environment page to update doorway details. It's shown when the user clicks the
ellipsis button on a doorway.

## Component Props
- `doorway: DensityDoorway` - The doorway to update.
- `onSubmit: ({name: string, desc: string}) => any` - A callback that is called with the updated doorway.
- `onDismiss: () => any` - A callback that is called when the modal is dismissed.
