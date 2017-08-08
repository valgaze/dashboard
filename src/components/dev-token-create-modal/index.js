import * as React from 'react';
import InputBox from '@density/ui-input-box';
import Modal, { ModalClose } from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';

const READONLY = 'readonly', READWRITE = 'readwrite';

export default class TokenCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      tokenType: READONLY,
    };
  }
  render() {
    return <Modal onClickBackdrop={this.props.onDismiss}>
      <div className="token-create">
        {this.props.loading ? <span>Loading</span> : null}
        {this.props.error ? <span>Error: {this.props.error}</span> : null}

        <Card>
          <CardHeader>
            Create token

            {/* Close button */}
            <ModalClose onClick={this.props.onDismiss} />
          </CardHeader>

          <CardBody>
            <div className="token-create-name-container">
              <label htmlFor="token-create-name">Token name</label>
              <InputBox
                type="text"
                id="token-create-name"
                placeholder="For development"
                value={this.state.name}
                onChange={e => this.setState({name: e.target.value})}
              />
            </div>
            <div className="token-create-description-container">
              <label htmlFor="token-create-desc">Token description</label>
              <textarea
                className="token-create-description-field"
                id="token-create-desc"
                placeholder="Making the next google"
                value={this.state.description}
                onChange={e => this.setState({description: e.target.value})}
              />
            </div>
            <div className="token-create-token-type-container">
              <label>Token Type</label>
              <br/>
              <label htmlFor="token-create-token-type-read-only">Read Only</label>
              <input
                type="radio"
                id="token-create-token-type-read-only"
                onChange={() => this.setState({tokenType: READONLY})}
                checked={this.state.tokenType === READONLY}
              />
              <br/>
              <label htmlFor="token-create-token-type-read-write">Read Write</label>
              <input
                type="radio"
                id="token-create-token-type-read-write"
                onChange={() => this.setState({tokenType: READWRITE})}
                checked={this.state.tokenType === READWRITE}
              />
            </div>

            <button
              className="token-create-modal-submit"
              disabled={this.state.name.length === 0}
              onClick={() => this.props.onSubmit({
                name: this.state.name,
                description: this.state.description,
                tokenType: this.state.tokenType,
              })}
            >Submit</button>
          </CardBody>
        </Card>
      </div>
    </Modal>;
  }
}
