import * as React from 'react';
import Modal, { ModalClose } from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';
import InputBox from '@density/ui-input-box';
import ModalHeaderActionButton from '../modal-header-action-button/index';

export default class WebhookUpdateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.initialWebhook.name || '',
      description: this.props.initialWebhook.description || '',
      key: this.props.initialWebhook.key || '',

      isDestroying: false,
    };
  }

  renderEdit() {
    return <div className="token-update-modal">
      <Modal onClickBackdrop={this.props.onDismiss}>
        <Card>
          <CardHeader>
            Edit Webhook

            {/* Edit button in the header */}
            <ModalHeaderActionButton
              className="token-update-destroy-link"
              onClick={() => this.setState({isDestroying: true})}
            >
              Destroy Webhook
            </ModalHeaderActionButton>

            {/* Close button */}
            <ModalClose onClick={this.props.onDismiss} />
          </CardHeader>
          <CardBody>
            <ul>
              <li>
                <label htmlFor="update-webhook-name">Webhook Name</label>
                <InputBox
                  type="text"
                  id="update-webhook-name"
                  value={this.state.name}
                  onChange={e => this.setState({name: e.target.value})}
                />
              </li>
              <li>
                <label htmlFor="update-webhook-desc">Description</label>
                <InputBox
                  type="text"
                  id="update-webhook-description"
                  value={this.state.description}
                  onChange={e => this.setState({description: e.target.value})}
                />
              </li>
            </ul>

            <button
              disabled={this.state.name.length === 0}
              onClick={() => this.props.onSubmit({
                id: this.props.initialWebhook.id,
                name: this.state.name,
                description: this.state.description,
                key: this.state.key,
              })}
            >Save</button>
          </CardBody>
        </Card>
      </Modal>
    </div>;
  }
  renderDestroy() {
    return <div className="webhook-update-modal">
      <Modal onClickBackdrop={this.props.onDismiss}>
        <Card>
          <CardHeader>
            Destroy Webhook

            {/* Edit button in the header */}
            <ModalHeaderActionButton onClick={() => this.setState({isDestroying: false})}>
              Go back to safety
            </ModalHeaderActionButton>

            {/* Close button */}
            <ModalClose onClick={this.props.onDismiss} />
          </CardHeader>
          <CardBody>
            <p>
              Removing a webhook means that the thing receiving the webhook will stop receiving
              events. This operation is reversable though unlike deleting a token - just create a
              webhook with the same contents.
            </p>

            <button
              onClick={() => this.props.onDestroyWebhook(this.props.initialWebhook)}
            >Delete</button>
          </CardBody>
        </Card>
      </Modal>
    </div>;
  }

  render() {
    if (this.state.isDestroying) {
      return this.renderDestroy.apply(this);
    } else {
      return this.renderEdit.apply(this);
    }
  }
}
