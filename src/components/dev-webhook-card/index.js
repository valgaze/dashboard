import * as React from 'react';

import Card, { CardHeader, CardBody } from '@density/ui-card';
import ModalHeaderActionButton from '../modal-header-action-button/index';

export default function WebhookCard({
  webhook,
  onClickEdit,
}) {
  return <Card className="webhook-card">
    <CardHeader>
      {webhook.name || '(no name)'}

      <ModalHeaderActionButton
        onClick={onClickEdit}
        className="webhook-card-edit"
      >Edit</ModalHeaderActionButton>
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
