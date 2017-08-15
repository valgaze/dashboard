import * as React from 'react';
import Modal from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';
import InputBox from '@density/ui-input-box';
import Button from '@density/ui-button';
import ModalHeaderActionButton from '../modal-header-action-button/index';

export default class TokenUpdateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.initialToken.name || '',
      description: this.props.initialToken.description || '',
      key: this.props.initialToken.key || '',

      isDestroying: false,
      destroyNameConfirmation: '',
    };
  }

  renderEdit() {
    return <div className="token-update-modal">
      <Modal onClose={this.props.onDismiss} onClickBackdrop={this.props.onDismiss}>
        <Card type="modal">
          <CardHeader>
            Edit Token

            {/* Edit button in the header */}
            <ModalHeaderActionButton
              className="token-update-destroy-link"
              onClick={() => this.setState({isDestroying: true})}
            >
              Destroy Token
            </ModalHeaderActionButton>
          </CardHeader>
          <CardBody>
            <ul>
              <li className="update-token-name-container">
                <label htmlFor="update-token-name">Token Name</label>
                <InputBox
                  type="text"
                  id="update-token-name"
                  value={this.state.name}
                  onChange={e => this.setState({name: e.target.value})}
                />
              </li>
              <li>
                <label htmlFor="update-token-desc">Description</label>
                <InputBox
                  type="text"
                  id="update-token-description"
                  value={this.state.description}
                  onChange={e => this.setState({description: e.target.value})}
                />
              </li>
            </ul>

            {this.props.loading ? <span>Loading</span> : null}
            {this.props.error ? <span>Error: {this.props.error}</span> : null}

            <Button
              className="token-update-modal-submit"
              disabled={this.state.name.length === 0}
              onClick={() => this.props.onSubmit({
                name: this.state.name,
                description: this.state.description,
                key: this.state.key,
              })}
            >Save Changes</Button>
          </CardBody>
        </Card>
      </Modal>
    </div>;
  }
  renderDestroy() {
    return <div className="token-update-modal">
      <Modal onClose={this.props.onDismiss} onClickBackdrop={this.props.onDismiss}>
        <Card type="modal">
          <CardHeader>
            Destroy Token

            {/* Edit button in the header */}
            <ModalHeaderActionButton onClick={() => this.setState({isDestroying: false})}>
              Go back to safety
            </ModalHeaderActionButton>
          </CardHeader>
          <CardBody>
            <h2 className="token-update-destroy-warning">Are you ABSOLUTELY sure?</h2>

            {this.props.loading ? <span>Loading</span> : null}
            {this.props.error ? <span>Error: {this.props.error}</span> : null}

            <p>
              The act of removing a token is irreversible - ie, you might have the token built into
              a compiled thing somewhere that would be hard / impossible to reassign. Type in the
              name of this token below (<code>{this.state.name}</code>) to remove.
            </p>

            <div className="token-update-destroy-confirmation">
              <InputBox
                type="text"
                value={this.state.destroyNameConfirmation}
                placeholder="Token Name"
                onChange={e => this.setState({destroyNameConfirmation: e.target.value})}
              />
            </div>

            <Button
              className="token-update-destroy-submit"
              disabled={this.state.name !== this.state.destroyNameConfirmation}
              onClick={() => this.props.onDestroyToken(this.props.initialToken)}
            >I understand the consequences. Delete.</Button>
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
