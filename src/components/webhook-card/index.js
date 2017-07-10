import * as React from 'react';

export default function WebhookCard({
  webhook,
}) {
  return <div className="webhook-card">
    {webhook.endpoint}
  </div>;
}
