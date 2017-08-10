import * as React from 'react';
import Modal, { ModalClose } from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';
import { decode } from 'ent';

export default class EnvironmentModalCreateSpace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      timeZone: '',
      resetTime: '',
    };
  }
  render() {
    return <div className="environment-modal-create-space">
      <Modal onClickBackdrop={this.props.onDismiss}>
        <Card>
          <CardHeader>
            Create Space

            {/* Close button */}
            <ModalClose onClick={this.props.onDismiss} />
          </CardHeader>
          <CardBody>
            {this.props.loading ? <span>Loading</span> : null}
            {this.props.error ? <span>Error: {this.props.error}</span> : null}

            <ul>
              <li className="create-space-name-container">
                <label htmlFor="create-space-name">Space Name</label>
                <input
                  type="text"
                  id="create-space-name"
                  value={this.state.name}
                  onChange={e => this.setState({name: e.target.value})}
                />
              </li>
              <li className="create-space-time-zone-container">
                <label htmlFor="create-space-time-zone">Time Zone</label>
                <select
                  id="create-space-time-zone"
                  value={this.state.timeZone}
                  onChange={e => this.setState({timeZone: e.target.value})}
                >
                  <option>(choose time zone)</option>
                  <option>America/New_York</option>
                  <option>America/Los_Angeles</option>
                </select>
              </li>
              <li className="create-space-reset-time-container">
                <label htmlFor="create-space-reset-time">Reset Time</label>
                <input
                  type="text"
                  id="create-space-reset-time"
                  value={this.state.resetTime}
                  onChange={e => this.setState({resetTime: e.target.value})}
                />
              </li>
            </ul>

            <div className="create-space-submit">
              <button
                disabled={(
                  this.state.name.length === 0 || this.state.timeZone.length === 0 ||
                  this.state.resetTime.length === 0
                )}
                onClick={() => this.props.onSubmit({
                  name: this.state.name,
                  resetTime: this.state.resetTime,
                  // this.state.timeZone has html entities in it, ie: `America&#x2F;New_York`.
                  // FIXME: Why is this?
                  timeZone: decode(this.state.timeZone),
                })}
              >Create</button>
            </div>
          </CardBody>
        </Card>
      </Modal>
    </div>;
  }
}
