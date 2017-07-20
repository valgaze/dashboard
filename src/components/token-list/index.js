import * as React from 'react';
import { connect } from 'react-redux';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';

import TokenCard from '../token-card/index';
import TokenCreateModal from '../token-create-modal/index';

import tokensPush from '../../actions/collection/tokens/push';

import Fab from '@density/ui-fab';

export function TokenList({
  tokens,
  activeModal,

  onCreateToken,
  onOpenModal,
  onCloseModal,
}) {
  return <div className="token-list">
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

    <h2>All tokens</h2>
    <div className="token-list-row">
      {tokens.data.map(token => {
        return <div className="token-list-item" key={token.key}>
          <TokenCard token={token} />
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
    onCreateToken({name, desc, tokenType}) {
      dispatch(tokensPush({name, desc, tokenType, key: 'tok_mynewtoken'+Math.random()}));
      dispatch(hideModal());
    },

    onOpenModal(name, data) {
      dispatch(showModal(name, data));
    },
    onCloseModal() {
      dispatch(hideModal());
    },
  }
})(TokenList);
