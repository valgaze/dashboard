import * as React from 'react';
import Modal from '@density/ui-modal';
import Button from '@density/ui-button';
import InputBox from '@density/ui-input-box';
import Card, { CardHeader, CardBody, CardLoading } from '@density/ui-card';
import FormLabel from '../form-label/index';

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
        <Card type="modal">
          {this.props.loading ? <CardLoading indeterminate /> : null}

          <CardHeader>Create Doorway</CardHeader>

          <CardBody>
            {this.props.error ? <span>Error: {this.props.error}</span> : null}

            <FormLabel
              className="create-doorway-name-container"
              htmlFor="create-doorway-name"
              label="Doorway Name"
              input={<InputBox
                type="text"
                id="create-doorway-name"
                value={this.state.name}
                onChange={e => this.setState({name: e.target.value})}
              />}
            />
            <FormLabel
              className="create-doorway-description-container"
              htmlFor="create-doorway-description"
              label="Description"
              input={<InputBox
                type="textarea"
                id="create-doorway-description"
                value={this.state.description}
                onChange={e => this.setState({description: e.target.value})}
              />}
            />

            <div className="create-doorway-submit">
              <Button
                disabled={this.state.name.length === 0}
                onClick={() => this.props.onSubmit(this.state)}
              >Create</Button>
            </div>
          </CardBody>
        </Card>
      </Modal>
    </div>;
  }
}
