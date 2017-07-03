import * as React from 'react';
import Modal from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';
import InputBox from '@density/ui-input-box';
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
  render() {
    return <div className="environment-modal-update-doorway">
      <Modal onClickBackdrop={this.props.onDismiss}>
        <Card>
          <CardHeader>
            Doorway Details
            {this.state.isEditing ? <ModalHeaderActionButton
              onClick={this.props.onDelete}
            >Delete</ModalHeaderActionButton> : <ModalHeaderActionButton
              onClick={() => this.setState({isEditing: true})}
            >Edit</ModalHeaderActionButton>}
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

            <button
              disabled={this.state.name.length === 0}
              onClick={() => this.props.onSubmit(this.state)}
            >Save</button>
          </CardBody>
        </Card>
      </Modal>
    </div>;
  }
}
