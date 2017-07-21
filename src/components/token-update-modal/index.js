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
    };
  }
  render() {
    return <div className="token-update-modal">
      <Modal onClickBackdrop={this.props.onDismiss}>
        <Card>
          <CardHeader>
            Edit Token

            {/* Edit button in the header */}
            <ModalHeaderActionButton onClick={this.props.onDestroyToken}>
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
              onClick={() => this.props.onSubmit(this.state)}
            >Save</button>
          </CardBody>
        </Card>
      </Modal>
    </div>;
  }
}
