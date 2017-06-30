import * as React from 'react';
import Modal from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';

export default function EnvironmentModalSensorPlacement({onSubmit, onDismiss}) {
  return <Modal onClickBackdrop={onDismiss}>
    <Card>
      <CardHeader>Sensor Placement</CardHeader>
      <CardBody>
        <p>
          There should be some text here. Something like "this has sweeping consequences" and "are you REALLY sure?"
        </p>
        <button onClick={onSubmit}>Swap sensor placement</button>
        <button onClick={onDismiss}>Cancel</button>
      </CardBody>
    </Card>
  </Modal>;
}
