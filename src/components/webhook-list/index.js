import * as React from 'react';
import { connect } from 'react-redux';

export function WebhookList({
  webhooks,
}) {
  return <div className="webhook-list">
    {JSON.stringify(webhooks.data)}
  </div>;
}


export default connect(state => {
  return {
    webhooks: state.webhooks,
  };
}, dispatch => {
  return {};
})(WebhookList);
