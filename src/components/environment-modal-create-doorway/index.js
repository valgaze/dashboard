import * as React from 'react';
import Modal, { ModalClose } from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';

export default class EnvironmentModalCreateDoorway extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      desc: '',
    };
  }
  render() {
    return <div className="environment-modal-create-space">
      <Modal onClickBackdrop={this.props.onDismiss}>
        <Card>
          <CardHeader>
            Create Doorway

            {/* Close button */}
            <ModalClose onClick={this.props.onDismiss} />
        </CardHeader>
          <CardBody>
            <ul>
              <li>
                <label htmlFor="create-doorway-name">Doorway Name</label>
                <input
                  type="text"
                  id="create-doorway-name"
                  value={this.state.name}
                  onChange={e => this.setState({name: e.target.value})}
                />
              </li>
              <li>
                <label htmlFor="create-doorway-desc">Description</label>
                <input
                  type="text"
                  id="create-doorway-desc"
                  value={this.state.desc}
                  onChange={e => this.setState({desc: e.target.value})}
                />
              </li>
            </ul>

            <button
              disabled={this.state.name.length === 0}
              onClick={() => this.props.onSubmit(this.state)}
            >Create</button>
          </CardBody>
        </Card>
      </Modal>
    </div>;
  }
}
