import * as React from 'react';
import Modal, { ModalClose } from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';
import InputBox from '@density/ui-input-box';
import Popover from '@density/ui-popover';
import ModalHeaderActionButton from '../modal-header-action-button/index';

export default class EnvironmentModalUpdateDoorway extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.initialDoorway.name || '',
      description: this.props.initialDoorway.description || '',
      isEditing: false,
    };
  }
  renderEdit() {
    return <div className="environment-modal-update-doorway edit">
      <Modal onClickBackdrop={this.props.onDismiss}>
        <Card>
          <CardHeader>
            Doorway Details

            {/* Edit button in the header */}
            <ModalHeaderActionButton
              onClick={() => this.setState({isEditing: true})}
            >Edit</ModalHeaderActionButton>

            {/* Close button */}
            <ModalClose onClick={this.props.onDismiss} />
          </CardHeader>
          <CardBody>
            <ul>
              <li>
                <label htmlFor="update-doorway-name">Doorway Name</label>
                <InputBox
                  type="text"
                  id="update-doorway-name"
                  value={this.state.name}
                  onChange={e => this.setState({name: e.target.value})}
                  disabled={!this.state.isEditing}
                />
              </li>
              <li>
                <label htmlFor="update-doorway-desc">Description</label>
                <InputBox
                  type="text"
                  id="update-doorway-description"
                  value={this.state.description}
                  onChange={e => this.setState({description: e.target.value})}
                  disabled={!this.state.isEditing}
                />
              </li>
            </ul>

            {this.state.isEditing ? <button
              disabled={this.state.name.length === 0}
              onClick={() => this.props.onSubmit(this.state)}
            >Save</button> : null}
          </CardBody>
        </Card>
      </Modal>
    </div>;
  }
  renderView() {
    const popover = <Card>
      <CardHeader>
        Doorway Details

        {/* Edit / Delete buttons */}
        <ModalHeaderActionButton
          onClick={() => this.setState({isEditing: true})}
        >Edit</ModalHeaderActionButton>

        {/* Close button */}
        <ModalClose onClick={this.props.onDismiss} />
      </CardHeader>
      <CardBody>
        <ul>
          <li>
            <label htmlFor="update-doorway-name">Doorway Name</label>
            <InputBox
              type="text"
              id="update-doorway-name"
              value={this.state.name}
              onChange={e => this.setState({name: e.target.value})}
              disabled
            />
          </li>
          <li>
            <label htmlFor="update-doorway-desc">Description</label>
            <InputBox
              type="text"
              id="update-doorway-description"
              value={this.state.description}
              onChange={e => this.setState({description: e.target.value})}
              disabled
            />
          </li>
        </ul>
      </CardBody>
    </Card>;

    return <div className="environment-modal-update-doorway view">
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