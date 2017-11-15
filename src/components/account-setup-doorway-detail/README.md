# AccountSetupDoorwayDetail

When the user selects a doorway name on the account setup doorway list page, they are brought to
this page. This page component shows all details related to a doorway, including front and back
images, doorway name, and doorway dimensions.

It's important to note that this is a stateful component. The prop `initialDoorway` allows one to
pass in the initial doorway state that the component will display. However, because the form is
mutable, further updating of the `initialDoorway` prop won't change the contents of the form.

## Component Props
- `initialDoorway: DensityDoorway` - The doorway state to prefill the form with.
