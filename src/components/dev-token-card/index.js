import * as React from 'react';

import Card, { CardHeader, CardBody } from '@density/ui-card';
import InputBox from '@density/ui-input-box';
import ModalHeaderActionButton from '../modal-header-action-button/index';

export default function TokenCard({token, onClickEdit}) {
  return <Card>
    <CardHeader size="small" className="token-card-header">
      <span className="token-card-header-text">{token.name || '(no name)'}</span>

      <div className="token-card-permissions-badge">
        {token.tokenType === 'readwrite' ? 'Read/Write' : 'Read Only'}
      </div>

      <ModalHeaderActionButton onClick={onClickEdit} className="token-card-edit">Edit</ModalHeaderActionButton>
    </CardHeader>
    <CardBody className="token-card-body">
      <InputBox
        type="text"
        className="token-card-token-content"
        value={token.key}
        readOnly={true}
        // Text box is read only and does not contain data that can be spell-checked.
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        // Select the contents of the textbox when the user clicks.
        onClick={e => e.target.select()}
      />
    </CardBody>
  </Card>;
}
