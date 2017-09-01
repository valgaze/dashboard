# EnvironmentModalSensorPlacement

A modal to confirm that a sensor placement will be changed. It's rendered on the `Environment` page.

## Component Props
- `space: DensitySpace` - The space that the sensor placement is being swapped on.
- `link: DensityLink` - The link that currently exists between the space and doorway.
- `loading: bool` - Should the modal display a loading state?
- `onSubmit: () => any` - User clicked "ok"
- `onDismiss: () => any` - User clicked "cancel"
