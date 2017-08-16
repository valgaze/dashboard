import * as React from 'react';
import InputBox from '@density/ui-input-box';
import Modal from '@density/ui-modal';
import Card, { CardHeader, CardLoading, CardBody } from '@density/ui-card';
import Button from '@density/ui-button';
import FormLabel from '../form-label/index';

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
    return <Modal onClose={this.props.onDismiss} onClickBackdrop={this.props.onDismiss}>
      <div className="token-create">
        {this.props.error ? <span>Error: {this.props.error}</span> : null}

        <Card type="modal">
          {this.props.loading ? <CardLoading indeterminate /> : null}
          <CardHeader>Create token</CardHeader>

          <CardBody>
            <FormLabel
              className="token-create-name-container"
              label="Token Name"
              htmlFor="update-token-name"
              input={<InputBox
                type="text"
                id="update-token-name"
                value={this.state.name}
                onChange={e => this.setState({name: e.target.value})}
              />}
            />
            <FormLabel
              className="token-create-description-container"
              label="Token description"
              htmlFor="token-create-desc"
              input={<textarea
                className="token-create-description-field"
                id="token-create-desc"
                value={this.state.description}
                onChange={e => this.setState({description: e.target.value})}
              />}
            />
            <FormLabel
              className="token-create-token-type-container"
              label="Token Type"
              htmlFor=""
              input={<div>
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
                </div>}
            />

            <Button
              className="token-create-modal-submit"
              disabled={this.state.name.length === 0}
              onClick={() => this.props.onSubmit({
                name: this.state.name,
                description: this.state.description,
                tokenType: this.state.tokenType,
              })}
            >Submit</Button>
          </CardBody>
        </Card>
      </div>
    </Modal>;
  }
}
