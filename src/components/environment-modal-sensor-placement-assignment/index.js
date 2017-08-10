import * as React from 'react';
import Modal from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';

export default function EnvironmentModalSensorPlacementAssignment({loading, error, onSubmit, onDismiss}) {
  return <Modal onClickBackdrop={onDismiss}>
    <Card>
      <CardHeader>Assign initial Sensor Placement</CardHeader>
      <CardBody>

        {loading ? <span>Loading</span> : null}
        {error ? <span>Error: {this.props.error}</span> : null}

        <p>
          There should be some text here.
        </p>
        <button onClick={() => onSubmit(-1)}>Outside the space</button>
        <button onClick={() => onSubmit(1)}>Inside the space</button>
        <button onClick={onDismiss}>Cancel</button>
      </CardBody>
    </Card>
  </Modal>;
}
