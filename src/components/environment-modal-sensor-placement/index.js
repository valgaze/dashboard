import * as React from 'react';
import Modal from '@density/ui-modal';
import Card, { CardHeader, CardLoading, CardBody } from '@density/ui-card';
import Button from '@density/ui-button';

export default function EnvironmentModalSensorPlacement({
  loading,
  space,
  link,

  onSubmit,
  onDismiss,
}) {
  return <Modal onClickBackdrop={onDismiss}>
    <Card type="modal" className="environment-modal-sensor-placement">
      {loading ? <CardLoading indeterminate /> : null}
      <CardHeader>Sensor Placement</CardHeader>
      <CardBody>
        <p>
          Are you sure you want to move the sensor from the
          <strong> {link.sensorPlacement === 1 ? 'inside' : 'outside'} </strong>
          to the
          <strong> {link.sensorPlacement === 1 ? 'outside' : 'inside'} </strong>
          of <strong>{space.name}</strong>?
        </p>

        <div className="environment-modal-sensor-placement-button-group">
          <Button className="environment-modal-sensor-placement-button-no" onClick={onDismiss}>No</Button>
          <Button className="environment-modal-sensor-placement-button-yes" onClick={onSubmit}>Yes</Button>
        </div>
      </CardBody>
    </Card>
  </Modal>;
}
