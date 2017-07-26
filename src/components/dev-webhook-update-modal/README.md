# WebhookUpdateModal

A modal used for updating the metadata associated with a webhook. It's a stateful component that
contains the content of the update form. In addition, it can turn into a confirm box to destroy a
webhook.

## Component Props
- `onSubmit: ({name, desc}) => any` - Callback that is called when the webhook is updated.
- `onDismiss: () => any` - Callback that is called when the modal is dismissed.
- `onDestroyWebhook: (id) => any` - Callback that is called when a webhook is destroyed.
