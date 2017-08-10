# EnvironmentModalCreateSpace

A modal window to create a new space, used on the environment page. It's stateful and stores the
current state of each field within itself, and on submit, passes its data to the parent component
via the `onSubmit` callback.

## Component Props
- `loading: bool` - Is the collection currently in a loading state (ie, a request has been sent to
  the server to create a token?)
- `error: Error | null` - An error in the given collection (ie, a response from the server contained
  an error)
- `onSubmit: ({name, timeZone, resetTime}) => any` - callback passed the form fields on submit.
