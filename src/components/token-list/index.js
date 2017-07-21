import * as React from 'react';
import { connect } from 'react-redux';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';

import TokenCard from '../token-card/index';
import TokenCreateModal from '../token-create-modal/index';
import TokenUpdateModal from '../token-update-modal/index';

import collectionTokensCreate from '../../actions/collection/tokens/create';
import collectionTokensUpdate from '../../actions/collection/tokens/update';
import collectionTokensFilter from '../../actions/collection/tokens/filter';

import Fab from '@density/ui-fab';
import InputBox from '@density/ui-input-box';

import filterCollection from '../../helpers/filter-collection/index';
const tokenFilter = filterCollection({fields: ['name', 'key']});

export function TokenList({
  tokens,
  activeModal,

  onCreateToken,
  onUpdateToken,
  onOpenModal,
  onCloseModal,
  onFilterTokenList,
}) {
  return <div className="token-list">
    <h2>All tokens</h2>

    {/* Search box to filter the list of tokens */}
    <InputBox
      placeholder="Search..."
      value={tokens.filters.search}
      onChange={e => onFilterTokenList(e.target.value)}
    />

    {/* The Fab triggers the space doorway context menu to make a new space or doorway */}
    <Fab onClick={() => {
      if (activeModal.name) {
        return onCloseModal();
      } else {
        return onOpenModal('token-create');
      }
    }}>+</Fab>

    {activeModal.name === 'token-create' ? <TokenCreateModal
      onSubmit={onCreateToken}
      onDismiss={onCloseModal}
    /> : null}
    {activeModal.name === 'token-update' ? <TokenUpdateModal
      initialToken={activeModal.data.token}
      onSubmit={onUpdateToken}
      onDismiss={onCloseModal}
    /> : null}

    <div className="token-list-row">
      {tokenFilter(tokens.data, tokens.filters.search).map(token => {
        return <div className="token-list-item" key={token.key}>
          <TokenCard token={token} onClickEdit={() => onOpenModal('token-update', {token})} />
        </div>;
      })}
    </div>
  </div>;
}

export default connect(state => {
  return {
    tokens: state.tokens,
    activeModal: state.activeModal,
  };
}, dispatch => {
  return {
    onCreateToken(token) {
      dispatch(collectionTokensCreate(token));
      dispatch(hideModal());
    },
    onUpdateToken(token) {
      dispatch(collectionTokensUpdate(token));
      dispatch(hideModal());
    },

    onOpenModal(name, data) {
      dispatch(showModal(name, data));
    },
    onCloseModal() {
      dispatch(hideModal());
    },
    onFilterTokenList(value) {
      dispatch(collectionTokensFilter('search', value));
    },
  }
})(TokenList);
