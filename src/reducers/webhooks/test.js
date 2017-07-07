import assert from 'assert';
import webhooks from './index';

import collectionWebhooksPush from '../../actions/collection/webhooks/push';
import collectionWebhooksSet from '../../actions/collection/webhooks/set';

const WEBHOOK_ID_ONE = 'tok_3wxsa6e8dh5zdnf73ubpnaq37wz2nawcjw8hh5sfawb',
      WEBHOOK_ID_TWO = 'tok_aus86m8834xef4cqjeye2hzz3u8j5aafucxjgkn695h';

describe('webhooks', function() {
  it('should set webhooks when given a bunch of webhooks', function() {
    const initialState = webhooks(undefined, {});

    const result = webhooks(initialState, collectionWebhooksSet([
      {endpoint: 'https://example.com', id: WEBHOOK_ID_ONE},
      {endpoint: 'https://density.io', id: WEBHOOK_ID_TWO},
    ]));

    assert.deepEqual(result, {
      ...initialState,
      loading: false,
      data: [
        {endpoint: 'https://example.com', id: WEBHOOK_ID_ONE},
        {endpoint: 'https://density.io', id: WEBHOOK_ID_TWO},
      ],
    });
  });
  it('should push webhook when given a webhook update', function() {
    const initialState = webhooks(undefined, {});

    // Add a new webhook.
    const webhookInCollection = webhooks(initialState, collectionWebhooksPush({
      id: WEBHOOK_ID_ONE,
      name: 'foo',
      endpoint: 'https://density.io',
    }));

    // Update webhook in collection
    const webhookUpdatedInCollection = webhooks(webhookInCollection, collectionWebhooksPush({
      id: WEBHOOK_ID_ONE,
      endpoint: 'https://example.com',
    }));

    assert.deepEqual(webhookUpdatedInCollection, {
      ...initialState,
      data: [{id: WEBHOOK_ID_ONE, endpoint: 'https://example.com', name: 'foo'}],
    });
  });
  it('should push webhook when given a new webhook', function() {
    const initialState = webhooks(undefined, {});

    const result = webhooks(initialState, collectionWebhooksPush({
      id: 0,
      name: 'foo',
      endpoint: 'https://density.io',
    }));

    assert.deepEqual(result, {
      ...initialState,
      data: [{id: 0, name: 'foo', endpoint: 'https://density.io'}],
    });
  });
});
