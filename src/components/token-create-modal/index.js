import * as React from 'react';
import InputBox from '@density/ui-input-box';
import Modal, { ModalClose } from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';

const READONLY = 'READONLY', READWRITE = 'READWRITE';

export default class TokenCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      desc: '',
      tokenType: READONLY,
    };
  }
  render() {
    return <Modal onClickBackdrop={this.props.onDismiss}>
      <Card className="token-create">
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
          <div className="token-create-desc-container">
            <label htmlFor="token-create-desc">Token description</label>
            <textarea
              className="token-create-description-field"
              id="token-create-desc"
              placeholder="Making the next google"
              value={this.state.desc}
              onChange={e => this.setState({desc: e.target.value})}
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
            disabled={this.state.name.length === 0}
            onClick={() => this.props.onSubmit({
              name: this.state.name,
              desc: this.state.desc,
              tokenType: this.state.tokenType,
            })}
          >Submit</button>
        </CardBody>
      </Card>
    </Modal>;
  }
}
