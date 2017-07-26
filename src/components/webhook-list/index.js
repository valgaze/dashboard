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

import WebhookCard from '../webhook-card/index';
import WebhookCreateModal from '../webhook-create/index';
import WebhookUpdateModal from '../webhook-update-modal/index';

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
  return <div className="webhook">
    <Subnav>
      <SubnavItem href="#/dev/tokens">Tokens</SubnavItem>
      <SubnavItem active href="#/dev/webhooks">Webhooks</SubnavItem>
    </Subnav>

    <div className="webhook-container">
      <h1>Webhooks</h1>

      {activeModal.name === 'webhook-create' ? <WebhookCreateModal
        onSubmit={onCreateWebhook}
        onDismiss={onCloseModal}
      /> : null}

      {activeModal.name === 'webhook-update' ? <WebhookUpdateModal
        initialWebhook={activeModal.data.webhook}
        onSubmit={onUpdateWebhook}
        onDismiss={onCloseModal}
        onDestroyWebhook={onDestroyWebhook}
      /> : null}

      {/* Search box to filter webhook list */}
      <InputBox
        placeholder="Search..."
        value={webhooks.filters.search}
        onChange={e => onFilterWebhookList(e.target.value)}
      />

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
      dispatch(collectionWebhooksCreate(webhook));
      dispatch(hideModal());
    },
    onFilterWebhookList(value) {
      dispatch(collectionWebhooksFilter('search', value));
    },
    onUpdateWebhook(webhook) {
      dispatch(collectionWebhooksUpdate(webhook));
      dispatch(hideModal());
    },
    onDestroyWebhook(webhook) {
      dispatch(collectionWebhooksDestroy(webhook));
      dispatch(hideModal());
    },

    onOpenModal(name, data) {
      dispatch(showModal(name, data));
    },
    onCloseModal() {
      dispatch(hideModal());
    },
  };
})(WebhookList);
