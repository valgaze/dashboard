import * as React from 'react';
import Modal from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';

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
          <CardHeader>Create Space</CardHeader>
          <CardBody>
            <ul>
              <li>
                <label htmlFor="create-space-name">Space Name</label>
                <input
                  type="text"
                  id="create-space-name"
                  value={this.state.name}
                  onChange={e => this.setState({name: e.target.value})}
                />
              </li>
              <li>
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
              <li>
                <label htmlFor="create-space-reset-time">Reset Time</label>
                <input
                  type="text"
                  id="create-space-reset-time"
                  value={this.state.resetTime}
                  onChange={e => this.setState({resetTime: e.target.value})}
                />
              </li>
            </ul>

            <button
              disabled={(
                this.state.name.length === 0 || this.state.timeZone.length === 0 ||
                this.state.resetTime.length === 0
              )}
              onClick={() => this.props.onSubmit(this.state)}
            >Create</button>
          </CardBody>
        </Card>
      </Modal>
    </div>;
  }
}
