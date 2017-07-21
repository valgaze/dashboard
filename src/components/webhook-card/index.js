import * as React from 'react';

import Card, { CardHeader, CardBody } from '@density/ui-card';

export default function WebhookCard({
  webhook,
}) {
  return <Card className="webhook-card">
    <CardHeader>
      {webhook.name || '(no name)'}
    </CardHeader>
    <CardBody>
      <p>{webhook.description || '(No description)'}</p>

      <span className="webhook-card-endpoint-label">PAYLOAD URL</span>
      <code className="webhook-card-endpoint">{webhook.endpoint}</code>

      <div className="webhook-card-active-checkbox">
        <input defaultChecked={true} type="checkbox" id={`webhook-card-${webhook.id}-active`} />
        <label htmlFor={`webhook-card-${webhook.id}-active`}>Active</label>
      </div>
    </CardBody>
  </Card>;
}
