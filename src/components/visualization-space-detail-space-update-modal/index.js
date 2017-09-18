import * as React from 'react';

import Modal from '@density/ui-modal';
import Card, { CardHeader, CardLoading, CardBody } from '@density/ui-card';
import Button from '@density/ui-button';

export default class VisualizationSpaceDetailSpaceUpdateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: this.props.space.currentCount,
      countText: null,
    };
  }
  render() {
    return <div className="visualization-space-detail-space-update-modal">
      <Modal onClose={this.props.onDismiss} onClickBackdrop={this.props.onDismiss}>
        <Card type="modal">
          {false ? <CardLoading indeterminate /> : null}
          <CardHeader>
            Update Count
            <span
              className="visualization-space-detail-space-update-modal-reset-count"
              onClick={() => this.setState({count: 0})}
            >Reset to zero</span>
          </CardHeader>
          <CardBody>
            <div className="visualization-space-detail-space-update-modal-count-picker">
              <button
                onClick={() => this.setState({count: this.state.count - 1})}
                disabled={this.state.count <= 0}
                className="visualization-space-detail-space-update-modal-count-button subtract"
              >&mdash;</button>

              <div className="visualization-space-detail-space-update-modal-count-picker-label">
                <input
                  type="number"
                  value={this.state.countText !== null ? this.state.countText : this.state.count}
                  onChange={e => this.setState({countText: e.target.value})}
                  onBlur={() => {
                    let parsed = parseInt(this.state.countText, 10);
                    if (parsed < 0) {
                      parsed = 0;
                    }

                    this.setState({
                      count: isNaN(parsed) ? this.state.count : parsed,
                      countText: null,
                    });
                  }}
                />
              </div>

              <button
                onClick={() => this.setState({count: this.state.count + 1})}
                className="visualization-space-detail-space-update-modal-count-button add"
              >+</button>
            </div>

            <Button
              onClick={() => this.props.onSubmit(this.state.count)}
            >Save changes</Button>
          </CardBody>
        </Card>
      </Modal>
    </div>
  }
}
