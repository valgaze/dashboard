import * as React from 'react';
import InputBox from '@density/ui-input-box';
import FormLabel from '../form-label/index';
import Button from '@density/ui-button';

import Modal from '@density/ui-modal';
import Card, { CardHeader, CardLoading, CardBody } from '@density/ui-card';

export default class WebhookCreateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      endpoint: '',
    };
  }
  render() {
    return <Modal onClose={this.props.onDismiss} onClickBackdrop={this.props.onDismiss}>
      <div className="webhook-create">
        <Card type="modal">
          {this.props.loading ? <CardLoading indeterminate /> : null}

          <CardHeader>Create webhook</CardHeader>

          <CardBody>
            <FormLabel
              className="webhook-create-name-container"
              htmlFor="webhook-create-name"
              label="Webhook name"
              input={<InputBox
                type="text"
                id="webhook-create-name"
                value={this.state.name}
                onChange={e => this.setState({name: e.target.value})}
              />}
            />
            <FormLabel
              className="webhook-create-description-container"
              htmlFor="webhook-create-desc"
              label="Webhook description"
              input={<InputBox
                type="textarea"
                id="webhook-create-desc"
                value={this.state.description}
                onChange={e => this.setState({description: e.target.value})}
              />}
            />
            <FormLabel
              className="webhook-create-endpoint-container"
              htmlFor="webhook-create-endpoint"
              label="Webhook URL"
              input={<InputBox
                id="webhook-create-endpoint"
                value={this.state.endpoint}
                onChange={e => this.setState({endpoint: e.target.value})}
              />}
            />

            <div className="webhook-create-example">
              <p>Webhooks will be sent as POST requests to the url specified above as JSON.</p>
              <p>
                Here's an example webhook payload:
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://docs.density.io/#webhooks-receiving"
                >More information</a>
              </p>
              <pre className="webhook-create-example-payload">{
                JSON.stringify({
                  "space_id": "2Azy0AUKO4LbG0RmNCO0zU",
                  "doorway_id": "bG0RmNCO0zU2Azy0AUKO4L",
                  "direction": 1,
                  "count": 32
                }, null, 2)
              }</pre>
            </div>

            {this.props.error ? <span>Error: {this.props.error}</span> : null}

            <Button
              className="webhook-create-modal-submit"
              disabled={this.state.endpoint.length === 0}
              onClick={() => this.props.onSubmit({
                name: this.state.name,
                desc: this.state.desc,
                endpoint: this.state.endpoint,
              })}
            >Submit</Button>
          </CardBody>
        </Card>
      </div>
    </Modal>;
  }
}
