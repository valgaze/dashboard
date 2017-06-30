import * as React from 'react';
import Modal from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';

export default function EnvironmentModalSensorPlacement({onSubmit, onDismiss}) {
  return <Modal onClickBackdrop={onDismiss}>
    <Card>
      <CardHeader>Sensor Placement</CardHeader>
      <CardBody>
        <p>
          There should be some text here.
        </p>
        <button onClick={onSubmit}>OK</button>
        <button onClick={onDismiss}>Cancel</button>
      </CardBody>
    </Card>
  </Modal>;
}
