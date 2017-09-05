import * as React from 'react';
import Modal from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';
import Button from '@density/ui-button';

export default function EnvironmentModalDoorwayAlreadyInSpace({doorway, space, onDismiss}) {
  return <Modal onClickBackdrop={onDismiss}>
    <Card type="modal" className="environment-modal-doorway-already-in-space">
      <CardHeader>Cannot do that!</CardHeader>
      <CardBody>
        <p>
          You can't add <strong>{doorway.name}</strong> to <strong>{space.name}</strong> &mdash; the
          doorway and space are already linked together.
        </p>

        <Button className="environment-modal-doorway-already-in-space-button" onClick={onDismiss}>Ok</Button>
      </CardBody>
    </Card>
  </Modal>;
}
