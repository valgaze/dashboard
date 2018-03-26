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
        <Card type="modal">
          <CardHeader className="insights-set-capacity-modal-header">Set Capacity</CardHeader>
          <CardBody>
            <div className="insights-set-capacity-modal-capacity-input">
              <InputBox
                type="number"
                value={this.state.capacityText !== null ? this.state.capacityText : (this.state.capacity || '')}
                onChange={e => this.setState({capacityText: e.target.value})}
                onBlur={() => {
                  let parsed = parseInt(this.state.capacityText, 10);
                  if (parsed < 0) {
                    parsed = null;
                  }

                  this.setState({
                    capacity: isNaN(parsed) ? this.state.capacity : parsed,
                    capacityText: null,
                  });
                }}
                placeholder="Capacity"
              />
            </div>

            <Button
              className="insights-set-capacity-modal-submit"
              disabled={this.state.capacity === null}
              onClick={() => this.props.onSubmit(this.state.capacity)}
            >Save changes</Button>
          </CardBody>
        </Card>
      </Modal>
    </div>
  }
}
