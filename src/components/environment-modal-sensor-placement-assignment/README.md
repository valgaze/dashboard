# EnvironmentModalSensorPlacementAssignment
A modal to assign the initial sensor placement when a doorway is initially dragged into a space.
It's rendered on the `Environment` page.

## Component Props
- `space: DensitySpace` - The space that a doorway is being assigned to.
- `onSubmit: (sensorPlacement) => any` - User clicked one of the sensor placement buttons
- `onDismiss: () => any` - User clicked "cancel"
