import * as React from 'react';

import Card, { CardHeader, CardBody } from '@density/ui-card';
import ModalHeaderActionButton from '../modal-header-action-button/index';

export default function TokenCard({
  token,
}) {
  return <Card>
    <CardHeader>
      {token.name}

      <div className="token-card-permissions-badge">
        {token.tokenType === 'readwrite' ? 'Read/Write' : 'Read Only'}
      </div>

      <ModalHeaderActionButton className="token-card-edit">Edit</ModalHeaderActionButton>
    </CardHeader>
    <CardBody>
      <p>{token.desc}</p>
      <code className="token-card-token-content">{token.key}</code>
      <button className="token-card-copy-token-button">Copy Token</button>
    </CardBody>
  </Card>;
}
