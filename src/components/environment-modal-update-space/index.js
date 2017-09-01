import * as React from 'react';
import { decode } from 'ent';

import Modal from '@density/ui-modal';
import Button from '@density/ui-button';
import Card, { CardHeader, CardLoading, CardBody } from '@density/ui-card';
import InputBox from '@density/ui-input-box';
import Popover from '@density/ui-popover';

import ModalHeaderActionButton from '../modal-header-action-button/index';
import FormLabel from '../form-label/index';
import generateLocalResetTimeChoices from '../../helpers/generate-local-reset-time-choices/index';

export default class EnvironmentModalUpdateSpace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.initialSpace.name || '',
      timeZone: this.props.initialSpace.timeZone || '',
      dailyReset: this.props.initialSpace.dailyReset || '',
      isEditing: false,
    };
  }
  renderEdit() {
    return <div className="environment-modal-update-space edit">
      <Modal onClose={this.props.onDismiss} onClickBackdrop={this.props.onDismiss}>
        <Card type="modal">
          {this.props.loading ? <CardLoading indeterminate /> : null}
          <CardHeader>
            Space Details

            {/* Edit / Delete button */}
            <ModalHeaderActionButton
              className="update-space-delete-button"
              onClick={this.props.onDelete}
            >Delete</ModalHeaderActionButton>
          </CardHeader>
          <CardBody>
            <FormLabel
              className="update-space-name-container"
              htmlFor="update-space-name"
              label="Space Name"
              input={
                <InputBox
                  type="text"
                  id="update-space-name"
                  value={this.state.name}
                  onChange={e => this.setState({name: e.target.value})}
                />
              }
            />
            <FormLabel
              className="update-space-time-zone-container"
              htmlFor="update-space-timezone"
              label="Time Zone"
              input={<InputBox
                type="select"
                id="update-space-timezone"
                value={this.state.timeZone}
                onChange={e => this.setState({timeZone: e.target.value})}
              >
                <option value="America/New_York">America &mdash; NY</option>
                <option value="America/Chicago">America &mdash; CHI</option>
                <option value="America/Denver">America &mdash; DEN</option>
                <option value="America/Los_Angeles">America &mdash; LA</option>
              </InputBox>}
            />
            <FormLabel
              className="update-space-daily-reset-container"
              htmlFor="update-space-daily-reset"
              label="Daily Reset"
              infoLabel="info for resets goes here."
              input={<InputBox
                type="select"
                id="update-space-daily-reset"
                value={this.state.dailyReset}
                onChange={e => this.setState({dailyReset: e.target.value})}
              >
                {generateLocalResetTimeChoices(this.state.timeZone).map(({localTime, utc}) =>
                  <option key={utc} value={utc}>{localTime}</option>)}
              </InputBox>}
            />

            <div className="environment-modal-update-space-submit">
              <Button
                disabled={this.state.name.length === 0}
                onClick={() => this.props.onSubmit({
                  name: this.state.name,
                  dailyReset: this.state.dailyReset,
                  // this.state.timeZone has html entities in it, ie: `America&#x2F;New_York`.
                  // FIXME: Why is this?
                  timeZone: decode(this.state.timeZone),
                })}
              >Save</Button>
            </div>
          </CardBody>
        </Card>
      </Modal>
    </div>;
  }
  renderView() {
    const popover = <Card>
      {this.props.loading ? <CardLoading indeterminate /> : null}
      <CardHeader>
        {/* Edit / Delete button */}
        <ModalHeaderActionButton
          className="update-space-edit-button"
          onClick={() => this.setState({isEditing: true})}
        >Edit</ModalHeaderActionButton>

        {/* Close button */}
        {/* <ModalClose onClick={this.props.onDismiss} /> */}
      </CardHeader>
      <CardBody>
        <FormLabel
          htmlFor="update-space-name"
          label="Space Name"
          input={<span>{this.state.name}</span>}
          editable={false}
        />

        <FormLabel
          htmlFor="update-space-timezone"
          label="Time Zone"
          input={<span>{this.state.timeZone}</span>}
          editable={false}
        />

        <FormLabel
          htmlFor="update-space-daily-reset"
          label="Daily Reset"
          input={<span>{(function(timeZone, dailyReset) {
            const resetTime = generateLocalResetTimeChoices(timeZone).find(i => i.utc === dailyReset)
            return resetTime ? resetTime.localTime : `${dailyReset} UTC`;
          })(this.state.timeZone, this.state.dailyReset)}</span>}
          editable={false}
        />

        <FormLabel
          className="environment-modal-update-space-doorway-container"
          htmlFor="display-space-doorways"
          label="Doorways"
          input={<div id="display-space-doorways">
            {this.props.doorways.map(doorway => <span
              className="environment-modal-update-space-doorway-pill"
              key={doorway.id}
            >{doorway.name}</span>)}
          </div>}
          editable={false}
        />
      </CardBody>
    </Card>;

    return <div className="environment-modal-update-space view">
      <Popover
        show={true}
        popover={popover}
        target={this.props.popoverPositionTarget}
        onDismiss={this.props.onDismiss}
      />
    </div>;
  }

  render() {
    if (this.state.isEditing) {
      return this.renderEdit();
    } else {
      return this.renderView();
    }
  }
}
