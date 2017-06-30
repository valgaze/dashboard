import * as React from 'react';
import Modal from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';

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
          <CardHeader>Doorway Details</CardHeader>
          <CardBody>
            <p onClick={() => this.setState({isEditing: true})}>Edit</p>
            <p onClick={this.props.onDelete}>Delete</p>

            <ul>
              <li>
                <label htmlFor="update-doorway-name">Doorway Name</label>
                <input
                  type="text"
                  id="update-doorway-name"
                  value={this.state.name}
                  onChange={e => this.setState({name: e.target.value})}
                />
              </li>
              <li>
                <label htmlFor="update-doorway-desc">Description</label>
                <input
                  type="text"
                  id="update-doorway-description"
                  value={this.state.description}
                  onChange={e => this.setState({description: e.target.value})}
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
