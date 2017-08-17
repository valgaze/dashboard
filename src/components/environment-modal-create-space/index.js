import * as React from 'react';
import Modal from '@density/ui-modal';
import Button from '@density/ui-button';
import InputBox from '@density/ui-input-box';
import Card, { CardHeader, CardLoading, CardBody } from '@density/ui-card';
import { decode } from 'ent';

import FormLabel from '../form-label/index';

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
      <Modal onClose={this.props.onDismiss} onClickBackdrop={this.props.onDismiss}>
        <Card type="modal">
          {this.props.loading ? <CardLoading indeterminate /> : null}
          <CardHeader>Create Space</CardHeader>
          <CardBody>
            {this.props.error ? <span>Error: {this.props.error}</span> : null}

            <FormLabel
              className="create-space-name-container"
              htmlFor="create-space-name"
              label="Space Name"
              input={<InputBox
                type="text"
                id="create-space-name"
                value={this.state.name}
                onChange={e => this.setState({name: e.target.value})}
              />}
            />
            <FormLabel
              className="create-space-time-zone-container"
              htmlFor="create-space-time-zone"
              label="Time Zone"
              input={<InputBox
                type="select"
                id="create-space-time-zone"
                value={this.state.timeZone}
                onChange={e => this.setState({timeZone: e.target.value})}
              >
                <option>(choose time zone)</option>
                <option value="America/New_York">America &mdash; NY</option>
                <option value="America/Chicago">America &mdash; CHI</option>
                <option value="America/Phoenix">America &mdash; PHX</option>
                <option value="America/Los_Angeles">America &mdash; LA</option>
              </InputBox>}
            />
            <FormLabel
              className="create-space-reset-time-container"
              htmlFor="create-space-reset-time"
              label="Reset Time"
              input={<InputBox
                type="text"
                id="create-space-reset-time"
                value={this.state.resetTime}
                onChange={e => this.setState({resetTime: e.target.value})}
              />}
            />

            <div className="create-space-submit">
              <Button
                disabled={(
                  this.state.name.length === 0 ||
                  this.state.timeZone.length === 0 ||
                  this.state.resetTime.length === 0
                )}
                onClick={() => this.props.onSubmit({
                  name: this.state.name,
                  resetTime: this.state.resetTime,
                  // this.state.timeZone has html entities in it, ie: `America&#x2F;New_York`.
                  // FIXME: Why is this?
                  timeZone: decode(this.state.timeZone),
                })}
              >Create</Button>
            </div>
          </CardBody>
        </Card>
      </Modal>
    </div>;
  }
}
