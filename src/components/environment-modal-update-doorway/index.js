import * as React from 'react';
import Modal from '@density/ui-modal';
import Card, { CardHeader, CardLoading, CardBody } from '@density/ui-card';
import InputBox from '@density/ui-input-box';
import Popover from '@density/ui-popover';
import ModalHeaderActionButton from '../modal-header-action-button/index';
import FormLabel from '../form-label/index';
import Button from '@density/ui-button';

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
      <Modal onClose={this.props.onDismiss} onClickBackdrop={this.props.onDismiss}>
        <Card type="modal">
          {this.props.loading ? <CardLoading indeterminate /> : null}
          <CardHeader>
            Doorway Details

            {/* Delete button in the header */}
            <ModalHeaderActionButton
              className="update-doorway-delete-button"
              onClick={this.props.onDelete}
            >Delete</ModalHeaderActionButton>
          </CardHeader>
          <CardBody>

            {this.props.error ? <span>Error: {this.props.error}</span> : null}

            <FormLabel
              className="update-doorway-name-container"
              htmlFor="update-doorway-name"
              label="Doorway Name"
              input={<InputBox
                type="text"
                id="update-doorway-name"
                value={this.state.name}
                onChange={e => this.setState({name: e.target.value})}
                disabled={!this.state.isEditing}
              />}
            />
            <FormLabel
              className="update-doorway-description-container"
              htmlFor="update-doorway-description"
              label="Description"
              input={<InputBox
                type="textarea"
                id="update-doorway-description"
                value={this.state.description}
                onChange={e => this.setState({description: e.target.value})}
                disabled={!this.state.isEditing}
              />}
            />

            <div className="environment-modal-update-doorway-submit">
              {this.state.isEditing ? <Button
                disabled={this.state.name.length === 0}
                onClick={() => this.props.onSubmit(this.state)}
              >Save</Button> : null}
            </div>
          </CardBody>
        </Card>
      </Modal>
    </div>;
  }
  renderView() {
    const popover = <Card>
      <CardHeader>
        {/* Edit buttons */}
        <ModalHeaderActionButton
          className="update-doorway-edit-button"
          onClick={() => this.setState({isEditing: true})}
        >Edit</ModalHeaderActionButton>

        {/* Close button */}
        {/* <ModalClose onClick={this.props.onDismiss} /> */}
      </CardHeader>
      <CardBody>
        <FormLabel
          className="update-doorway-name-readonly"
          htmlFor="update-doorway-name-readonly"
          label="Doorway Name"
          input={<span id="update-doorway-name-readonly">{this.state.name}</span>}
          editable={false}
        />
        <FormLabel
          className="update-doorway-description-readonly"
          htmlFor="update-doorway-description-readonly"
          label="Description"
          input={<span id="update-doorway-description-readonly">{this.state.description}</span>}
          editable={false}
        />
      </CardBody>
    </Card>;

    return <div className="environment-modal-update-doorway view">
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
