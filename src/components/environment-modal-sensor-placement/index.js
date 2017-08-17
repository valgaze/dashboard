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
          Would you like to swap sensor placement?
          There should be some text here. And probably a graphic.
        </p>

        <div className="environment-modal-sensor-placement-button-group">
          <Button className="environment-modal-sensor-placement-button-yes" onClick={onDismiss}>No</Button>
          <Button className="environment-modal-sensor-placement-button-no" onClick={onSubmit}>Yes</Button>
        </div>
      </CardBody>
    </Card>
  </Modal>;
}
