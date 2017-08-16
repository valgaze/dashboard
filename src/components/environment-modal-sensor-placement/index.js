import * as React from 'react';
import Modal from '@density/ui-modal';
import Card, { CardHeader, CardLoading, CardBody } from '@density/ui-card';
import Button from '@density/ui-button';

export default function EnvironmentModalSensorPlacement({loading, error, onSubmit, onDismiss}) {
  return <Modal onClickBackdrop={onDismiss}>
    <Card type="modal" className="environment-modal-sensor-placement">
      {loading ? <CardLoading indeterminate /> : null}
      <CardHeader>Sensor Placement</CardHeader>
      <CardBody>
        {error ? <span>Error: {this.props.error}</span> : null}

        <p>
          There should be some text here. Something like "this has sweeping consequences" and "are you REALLY sure?"
        </p>
        <Button onClick={onSubmit}>Swap sensor placement</Button>
        <Button onClick={onDismiss}>Cancel</Button>
      </CardBody>
    </Card>
  </Modal>;
}
