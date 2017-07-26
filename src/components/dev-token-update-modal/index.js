import * as React from 'react';
import Modal, { ModalClose } from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';
import InputBox from '@density/ui-input-box';
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
      <Modal onClickBackdrop={this.props.onDismiss}>
        <Card>
          <CardHeader>
            Edit Token

            {/* Edit button in the header */}
            <ModalHeaderActionButton
              className="token-update-destroy-link"
              onClick={() => this.setState({isDestroying: true})}
            >
              Destroy Token
            </ModalHeaderActionButton>

            {/* Close button */}
            <ModalClose onClick={this.props.onDismiss} />
          </CardHeader>
          <CardBody>
            <ul>
              <li>
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

            <button
              disabled={this.state.name.length === 0}
              onClick={() => this.props.onSubmit({
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
    return <div className="token-update-modal">
      <Modal onClickBackdrop={this.props.onDismiss}>
        <Card>
          <CardHeader>
            Destroy Token

            {/* Edit button in the header */}
            <ModalHeaderActionButton onClick={() => this.setState({isDestroying: false})}>
              Go back to safety
            </ModalHeaderActionButton>

            {/* Close button */}
            <ModalClose onClick={this.props.onDismiss} />
          </CardHeader>
          <CardBody>
            <h1>Are you ABSOLUTELY sure?</h1>

            <p>
              The act of removing a token is irreversible - ie, you might have the token built into
              a compiled thing somewhere that would be hard / impossible to reassign. Type in the
              name of this token below (<code>{this.state.name}</code>) to remove.
            </p>

            <InputBox
              type="text"
              value={this.state.destroyNameConfirmation}
              placeholder={this.state.name}
              onChange={e => this.setState({destroyNameConfirmation: e.target.value})}
            />

            <button
              disabled={this.state.name !== this.state.destroyNameConfirmation}
              onClick={() => this.props.onDestroyToken(this.props.initialToken)}
            >I got it, get rid of my token!</button>
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
