# TokenCreate

A component that allows the user to create a new token. It has fields for token name, description,
and permission level. It's stateful and holds the intermediate values for the token name,
description, and more until they are sent to the server.

## Component Props
- `onSubmit: ({name, description, tokenType}) => any` - User sumbitted the token creation form.
