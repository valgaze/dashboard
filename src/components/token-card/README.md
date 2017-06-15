# TokenCard

What does this component do?
Is the component stateful?
Is this component a page in the app or a presentational component (or something else?)

This presentational component displays information about a token on the token list page. This
includes the token and a status on whether it's read only or read-write.

## Component Props
- `token: string` - The literal token to display.
- `tokenType: string` - Either `readwrite` or `readonly`.
