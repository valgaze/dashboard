# WebhookCreate

A form used to create webhooks. It's stateful and contains the intermediate values of the webhook.

## Component Props
- `initialWebhook: DensityWebhook` - Initial webhook to populate the state with.
- `onSubmit: ({name, desc, endpoint}) => any` - When the user clicks the submit button, fire this
  callback to send the new webhook to the server (not in this component).
