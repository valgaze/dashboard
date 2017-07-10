import * as React from 'react';
import { connect } from 'react-redux';

import WebhookCard from '../webhook-card/index';
import WebhookCreate from '../webhook-create/index';

import collectionWebhooksCreate from '../../actions/collection/webhooks/create'

export function WebhookList({
  webhooks,
  onCreateWebhook,
}) {
  return <div className="webhook-list">
    <WebhookCreate onSubmit={onCreateWebhook} />
    {webhooks.data.map(webhook => {
      return <div className="webhook-list-item" key={webhook.id}>
        <WebhookCard webhook={webhook} />
      </div>;
    })}
  </div>;
}


export default connect(state => {
  return {
    webhooks: state.webhooks,
  };
}, dispatch => {
  return {
    onCreateWebhook(webhook) {
      dispatch(collectionWebhooksCreate(webhook));
    },
  };
})(WebhookList);
