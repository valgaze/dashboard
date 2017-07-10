import * as React from 'react';
import InputBox from '@density/ui-input-box';

export default class WebhookCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      desc: '',
      endpoint: '',
    };
  }
  render() {
    return <div className="webhook-create">
      <h1>Create webhook</h1>

      <div className="webhook-create-name-container">
        <label htmlFor="webhook-create-name">Webhook name</label>
        <InputBox
          type="text"
          id="webhook-create-name"
          placeholder="For development"
          value={this.state.name}
          onChange={e => this.setState({name: e.target.value})}
        />
      </div>
      <div className="webhook-create-desc-container">
        <label htmlFor="webhook-create-desc">Webhook description</label>
        <InputBox
          id="webhook-create-desc"
          placeholder="Making the next google"
          value={this.state.desc}
          onChange={e => this.setState({desc: e.target.value})}
        />
      </div>
      <div className="webhook-create-endpoint-container">
        <label htmlFor="webhook-create-endpoint">webhook endpoint</label>
        <InputBox
          id="webhook-create-endpoint"
          placeholder="https://example.com"
          value={this.state.endpoint}
          onChange={e => this.setState({endpoint: e.target.value})}
        />
      </div>

      <button
        disabled={this.state.endpoint.length === 0}
        onClick={() => this.props.onSubmit({
          name: this.state.name,
          desc: this.state.desc,
          endpoint: this.state.endpoint,
        })}
      >Submit</button>
    </div>;
  }
}
