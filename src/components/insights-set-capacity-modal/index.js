import * as React from 'react';

import Modal from '@density/ui-modal';
import InputBox from '@density/ui-input-box';
import Card, { CardHeader, CardBody } from '@density/ui-card';
import Button from '@density/ui-button';

export default class InsightsSetCapacityModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      capacity: this.props.space.capacity,
      capacityText: null,
    };
  }
  render() {
    return <div className="insights-set-capacity-modal">
      <Modal onClose={this.props.onDismiss} onClickBackdrop={this.props.onDismiss}>
        <Card className="insights-set-capacity-modal-card" type="modal">
          <CardHeader className="insights-set-capacity-modal-header">Set Capacity: {this.props.space.name}</CardHeader>
          <CardBody>
            <div className="insights-set-capacity-modal-capacity-input">
              <InputBox
                type="number"
                value={this.state.capacityText !== null ? this.state.capacityText : (this.state.capacity || '')}
                onChange={e => {
                  if (e.target.value === '') {
                    this.setState({capacity: null, capacityText: ''});
                    return
                  }

                  let parsed = parseInt(e.target.value, 10);
                  if (parsed < 0) {
                    parsed = null;
                  }

                  this.setState({
                    capacity: isNaN(parsed) ? this.state.capacity : parsed,
                    capacityText: e.target.value,
                  });
                }}
                placeholder="Capacity"
              />
            </div>

            <div className="insights-set-capacity-modal-submit">
              <Button
                disabled={this.state.capacity === null}
                onClick={() => this.props.onSubmit(this.state.capacity)}
              >Save changes</Button>
            </div>
          </CardBody>
        </Card>
      </Modal>
    </div>
  }
}
