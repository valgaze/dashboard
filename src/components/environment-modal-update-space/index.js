import * as React from 'react';
import Modal from '@density/ui-modal';
import Button from '@density/ui-button';
import Card, { CardHeader, CardLoading, CardBody } from '@density/ui-card';
import InputBox from '@density/ui-input-box';
import Popover from '@density/ui-popover';
import ModalHeaderActionButton from '../modal-header-action-button/index';
import FormLabel from '../form-label/index';

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
            {this.props.error ? <span>Error: {this.props.error}</span> : null}
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
                type="text"
                id="update-doorway-timezone"
                value={this.state.timeZone}
                onChange={e => this.setState({timeZone: e.target.value})}
              />}
            />
            <FormLabel
              className="update-space-daily-reset-container"
              htmlFor="update-space-daily-reset"
              label="Daily Reset"
              input={<InputBox
                type="text"
                id="update-space-daily-reset"
                value={this.state.dailyReset}
                onChange={e => this.setState({dailyReset: e.target.value})}
              />}
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
            />

            <div className="environment-modal-update-space-submit">
              <Button
                disabled={this.state.name.length === 0}
                onClick={() => this.props.onSubmit(this.state)}
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
        Space Details

        {/* Edit / Delete button */}
        <ModalHeaderActionButton
          className="update-space-edit-button"
          onClick={() => this.setState({isEditing: true})}
        >Edit</ModalHeaderActionButton>

        {/* Close button */}
        {/* <ModalClose onClick={this.props.onDismiss} /> */}
      </CardHeader>
      <CardBody>
        {this.props.error ? <span>Error: {this.props.error}</span> : null}
        <ul>
          <li>
            <label htmlFor="update-space-name">Space Name</label>
            <InputBox
              type="text"
              id="update-space-name"
              value={this.state.name}
              onChange={e => this.setState({name: e.target.value})}
              disabled
            />
          </li>
          <li>
            <label htmlFor="update-space-timezone">Time Zone</label>
            <InputBox
              type="text"
              id="update-doorway-timezone"
              value={this.state.timeZone}
              onChange={e => this.setState({timeZone: e.target.value})}
              disabled
            />
          </li>
          <li>
            <label htmlFor="update-space-daily-reset">Daily Reset</label>
            <InputBox
              type="text"
              id="update-space-daily-reset"
              value={this.state.dailyReset}
              onChange={e => this.setState({dailyReset: e.target.value})}
              disabled
            />
          </li>
          <li className="environment-modal-update-space-doorway-container">
            <label htmlFor="display-space-doorways">Doorways</label>
            <div id="display-space-doorways">
              {this.props.doorways.map(doorway => <span
                className="environment-modal-update-space-doorway-pill"
                key={doorway.id}
              >{doorway.name}</span>)}
            </div>
          </li>
        </ul>
      </CardBody>
    </Card>;

    return <div className="environment-modal-update-space view">
      <Popover
        show={true}
        popover={popover}
        target={this.props.popoverPositionTarget}
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
