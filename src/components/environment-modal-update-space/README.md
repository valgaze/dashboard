# EnvironmentModalUpdateSpace

A modal shown on the environment page to update space details. It's shown when the user clicks the
ellipsis button on a space.

## Component Props
- `initialSpace: DensitySpace` - The space to update.
- `onSubmit: ({name, description, timezone, dailyReset}) => any` - A callback that is called with the updated space.
- `onDismiss: () => any` - A callback that is called when the modal is dismissed.
