import * as React from 'react';
import Modal from '@density/ui-modal';
import Card, { CardHeader, CardLoading, CardBody } from '@density/ui-card';
import Button from '@density/ui-button';

export default function EnvironmentModalSensorPlacementAssignment({loading, error, onSubmit, onDismiss}) {
  return <Modal onClickBackdrop={onDismiss}>
    <Card type="modal" className="environment-modal-sensor-placement-assignment">
      {loading ? <CardLoading indeterminate /> : null}
      <CardHeader>Assign Sensor Placement</CardHeader>
      <CardBody>

        {error ? <span>Error: {this.props.error}</span> : null}

        <p>
          There should be some text here.
        </p>
        <Button onClick={() => onSubmit(-1)}>Outside the space</Button>
        <Button onClick={() => onSubmit(1)}>Inside the space</Button>
        <Button onClick={onDismiss}>Cancel</Button>
      </CardBody>
    </Card>
  </Modal>;
}
