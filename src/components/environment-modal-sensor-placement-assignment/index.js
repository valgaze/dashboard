import * as React from 'react';
import Modal from '@density/ui-modal';
import Card, { CardHeader, CardLoading, CardBody } from '@density/ui-card';
import Button from '@density/ui-button';

export default function EnvironmentModalSensorPlacementAssignment({
  space,
  loading,
  error,

  onSubmit,
  onDismiss,
}) {
  return <Modal onClickBackdrop={onDismiss}>
    <Card type="modal" className="environment-modal-sensor-placement-assignment">
      {loading ? <CardLoading indeterminate /> : null}
      <CardHeader>Assign Sensor Placement</CardHeader>
      <CardBody>
        <p>
          Is the sensor inside or outside of <strong>{space.name}</strong>?
        </p>

        <div className="environment-modal-sensor-placement-assignment-button-group">
          <Button onClick={() => onSubmit(-1)}>Outside the space</Button>
          <Button onClick={() => onSubmit(1)}>Inside the space</Button>
        </div>
        <Button className="environment-modal-sensor-placement-assignment-button-close" onClick={onDismiss}>Cancel</Button>
      </CardBody>
    </Card>
  </Modal>;
}
