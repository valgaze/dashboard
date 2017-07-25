import * as React from 'react';
import Modal, { ModalClose } from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';
import InputBox from '@density/ui-input-box';
import Popover from '@density/ui-popover';
import ModalHeaderActionButton from '../modal-header-action-button/index';

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
      <Modal onClickBackdrop={this.props.onDismiss}>
        <Card>
          <CardHeader>
            Space Details

            {/* Edit / Delete button */}
            <ModalHeaderActionButton
              onClick={this.props.onDelete}
            >Delete</ModalHeaderActionButton>

            {/* Close button */}
            <ModalClose onClick={this.props.onDismiss} />
          </CardHeader>
          <CardBody>
            <ul>
              <li>
                <label htmlFor="update-space-name">Space Name</label>
                <InputBox
                  type="text"
                  id="update-space-name"
                  value={this.state.name}
                  onChange={e => this.setState({name: e.target.value})}
                />
              </li>
              <li>
                <label htmlFor="update-space-timezone">Time Zone</label>
                <InputBox
                  type="text"
                  id="update-doorway-timezone"
                  value={this.state.timeZone}
                  onChange={e => this.setState({timeZone: e.target.value})}
                />
              </li>
              <li>
                <label htmlFor="update-space-daily-reset">Daily Reset</label>
                <InputBox
                  type="text"
                  id="update-space-daily-reset"
                  value={this.state.dailyReset}
                  onChange={e => this.setState({dailyReset: e.target.value})}
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

            <button
              disabled={this.state.name.length === 0}
              onClick={() => this.props.onSubmit(this.state)}
            >Save</button>
          </CardBody>
        </Card>
      </Modal>
    </div>;
  }
  renderView() {
    const popover = <Card>
      <CardHeader>
        Space Details

        {/* Edit / Delete button */}
        <ModalHeaderActionButton
          onClick={() => this.setState({isEditing: true})}
        >Edit</ModalHeaderActionButton>

        {/* Close button */}
        <ModalClose onClick={this.props.onDismiss} />
      </CardHeader>
      <CardBody>
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
