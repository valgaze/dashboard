# EnvironmentModalCreateDoorway

A modal window to create a new doorway, used on the environment page. It's stateful and stores the
current state of each field within itself, and on submit, passes its data to the parent component
via the `onSubmit` callback.

## Component Props
- `onSubmit: ({name, description}) => any` - callback passed the form fields on submit.
