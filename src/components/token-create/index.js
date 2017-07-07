import * as React from 'react';
import InputBox from '@density/ui-input-box';

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
    return <div className="token-create">
      <h1>Create token</h1>

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
    </div>;
  }
}
