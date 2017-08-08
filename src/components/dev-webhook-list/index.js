import * as React from 'react';
import { connect } from 'react-redux';

import Fab from '@density/ui-fab';
import InputBox from '@density/ui-input-box';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';
import collectionWebhooksCreate from '../../actions/collection/webhooks/create';
import collectionWebhooksFilter from '../../actions/collection/webhooks/filter';
import collectionWebhooksUpdate from '../../actions/collection/webhooks/update';
import collectionWebhooksDestroy from '../../actions/collection/webhooks/destroy';

import Subnav, { SubnavItem } from '../subnav/index';

import WebhookCard from '../dev-webhook-card/index';
import WebhookCreateModal from '../dev-webhook-create/index';
import WebhookUpdateModal from '../dev-webhook-update-modal/index';

import filterCollection from '../../helpers/filter-collection/index';

const webhookFilter = filterCollection({fields: ['name', 'endpoint']});

export function WebhookList({
  webhooks,
  activeModal,

  onCreateWebhook,
  onFilterWebhookList,
  onUpdateWebhook,
  onDestroyWebhook,
  onOpenModal,
  onCloseModal,
}) {
  const modals = <div>
    {activeModal.name === 'webhook-create' ? <WebhookCreateModal
      error={webhooks.error}
      loading={webhooks.loading}

      onSubmit={onCreateWebhook}
      onDismiss={onCloseModal}
    /> : null}

    {activeModal.name === 'webhook-update' ? <WebhookUpdateModal
      initialWebhook={activeModal.data.webhook}
      error={webhooks.error}
      loading={webhooks.loading}

      onSubmit={onUpdateWebhook}
      onDismiss={onCloseModal}
      onDestroyWebhook={onDestroyWebhook}
    /> : null}
  </div>;

  // Sub navigation under the main navbar. USed to navigate within the dev tools section.
  const subnav = <Subnav>
    <SubnavItem href="#/dev/tokens">Tokens</SubnavItem>
    <SubnavItem active href="#/dev/webhooks">Webhooks</SubnavItem>
    <SubnavItem external href="http://docs.density.io/">API Documentation</SubnavItem>
  </Subnav>;

  if (webhooks.loading) {
    return <div className="webhook-list">
      {modals}
      {subnav}
      <div className="webhook-list-loading">Loading...</div>
    </div>;
  }

  return <div className="webhook">
    {modals}
    {subnav}

    <div className="webhook-container">
      <h1>Webhooks</h1>

      {/* Search box to filter webhook list */}
      <div className="webhook-list-search">
        <InputBox
          placeholder="Search..."
          value={webhooks.filters.search}
          onChange={e => onFilterWebhookList(e.target.value)}
        />
      </div>

      {/* The Fab triggers the space doorway context menu to make a new space or doorway */}
      <Fab onClick={() => onOpenModal('webhook-create')}>+</Fab>

      <div className="webhook-list">
        {webhookFilter(webhooks.data, webhooks.filters.search).map(webhook => {
          return <div className="webhook-list-item" key={webhook.id}>
            <WebhookCard
              webhook={webhook}
              onClickEdit={() => onOpenModal('webhook-update', {webhook})}
            />
          </div>;
        })}
      </div>
    </div>
  </div>;
}


export default connect(state => {
  return {
    webhooks: state.webhooks,
    activeModal: state.activeModal,
  };
}, dispatch => {
  return {
    onCreateWebhook(webhook) {
      dispatch(collectionWebhooksCreate(webhook)).then(() => {
        dispatch(hideModal());
      });
    },
    onFilterWebhookList(value) {
      dispatch(collectionWebhooksFilter('search', value));
    },
    onUpdateWebhook(webhook) {
      dispatch(collectionWebhooksUpdate(webhook)).then(() => {
        dispatch(hideModal());
      });
    },
    onDestroyWebhook(webhook) {
      dispatch(collectionWebhooksDestroy(webhook)).then(() => {
        dispatch(hideModal());
      });
    },

    onOpenModal(name, data) {
      dispatch(showModal(name, data));
    },
    onCloseModal() {
      dispatch(hideModal());
    },
  };
})(WebhookList);
