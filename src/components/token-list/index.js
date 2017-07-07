import * as React from 'react';
import { connect } from 'react-redux';

import TokenCard from '../token-card/index';
import TokenCreate from '../token-create/index';

import tokensPush from '../../actions/collection/tokens/push';

export function TokenList({
  tokens,

  onCreateToken,
}) {
  return <div className="token-list">
    <TokenCreate onSubmit={onCreateToken} />

    <h2>All tokens</h2>
    {tokens.data.map(token => {
      return <div className="token-list-item" key={token.key}>
        <TokenCard token={token} />
      </div>;
    })}
  </div>;
}

export default connect(state => {
  return {
    tokens: state.tokens,
  };
}, dispatch => {
  return {
    onCreateToken({name, desc, tokenType}) {
      dispatch(tokensPush({name, desc, tokenType, key: 'tok_mynewtoken'}));
    },
  }
})(TokenList);
