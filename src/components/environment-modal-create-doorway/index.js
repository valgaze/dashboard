import * as React from 'react';
import Modal from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';

export default class EnvironmentModalCreateDoorway extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
    };
  }
  render() {
    return <div className="environment-modal-create-doorway">
      <Modal onClose={this.props.onDismiss} onClickBackdrop={this.props.onDismiss}>
        <Card>
          <CardHeader>
            Create Doorway
          </CardHeader>
          <CardBody>

            {this.props.loading ? <span>Loading</span> : null}
            {this.props.error ? <span>Error: {this.props.error}</span> : null}

            <ul>
              <li className="create-doorway-name-container">
                <label htmlFor="create-doorway-name">Doorway Name</label>
                <input
                  type="text"
                  id="create-doorway-name"
                  value={this.state.name}
                  onChange={e => this.setState({name: e.target.value})}
                />
              </li>
              <li className="create-doorway-description-container">
                <label htmlFor="create-doorway-description">Description</label>
                <input
                  type="text"
                  id="create-doorway-description"
                  value={this.state.description}
                  onChange={e => this.setState({description: e.target.value})}
                />
              </li>
            </ul>

            <div className="create-doorway-submit">
              <button
                disabled={this.state.name.length === 0}
                onClick={() => this.props.onSubmit(this.state)}
              >Create</button>
            </div>
          </CardBody>
        </Card>
      </Modal>
    </div>;
  }
}
