import * as React from 'react';
import Modal from '@density/ui-modal';
import Button from '@density/ui-button';
import InputBox from '@density/ui-input-box';
import Card, { CardHeader, CardLoading, CardBody } from '@density/ui-card';
import { decode } from 'ent';

import FormLabel from '../form-label/index';
import generateLocalResetTimeChoices from '../../helpers/generate-local-reset-time-choices/index';

export default class EnvironmentModalCreateSpace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      timeZone: '',
      dailyReset: '12:00',
    };
  }
  render() {
    return <div className="environment-modal-create-space">
      <Modal onClose={this.props.onDismiss} onClickBackdrop={this.props.onDismiss}>
        <Card type="modal">
          {this.props.loading ? <CardLoading indeterminate /> : null}
          <CardHeader>Create Space</CardHeader>
          <CardBody>
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
                <option value="">(choose time zone)</option>
                <option value="America/New_York">America &mdash; NY</option>
                <option value="America/Chicago">America &mdash; CHI</option>
                <option value="America/Denver">America &mdash; DEN</option>
                <option value="America/Los_Angeles">America &mdash; LA</option>
              </InputBox>}
            />
            <FormLabel
              className="create-space-reset-time-container"
              htmlFor="create-space-reset-time"
              label="Reset Time"
              input={<InputBox
                type="select"
                id="create-space-reset-time"
                value={this.state.dailyReset}
                disabled={this.state.timeZone.length === 0}
                onChange={e => this.setState({dailyReset: e.target.value})}
              >
                {this.state.timeZone ?
                  generateLocalResetTimeChoices(this.state.timeZone)
                    .map(({localTime, utc}) => <option key={utc} value={utc}>{localTime}</option>)
                : null}
              </InputBox>}
            />

            <div className="create-space-submit">
              <Button
                disabled={(
                  this.state.name.length === 0 ||
                  this.state.timeZone.length === 0 ||
                  this.state.dailyReset.length === 0
                )}
                onClick={() => this.props.onSubmit({
                  name: this.state.name,
                  dailyReset: this.state.dailyReset,
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
