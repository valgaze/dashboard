# EnvironmentModalDoorwayAlreadyInSpace

A modal that is visible when the user trys to drag a space into a doorway that
already contains the dragged doorway. It's purely presentational, as its just a dismissable modal.

## Component Props
- `doorway: DensityDoorway` - The given doorway that was dragged.
- `space: DensitySpace` - The given space that the doorway was dropped within.
- `onDismiss: () => any` - Called when the user dismisses the modal.
