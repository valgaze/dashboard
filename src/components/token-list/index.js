import * as React from 'react';
import { connect } from 'react-redux';

import TokenCard from '../token-card/index';

export function TokenList({tokens}) {
  return <div className="token-list">
    {tokens.data.map(token => {
      return <div className="token-list-item" key={token.key}>
        <TokenCard
          token={token.key}
          tokenType={token.tokenType}
        />
      </div>;
    })}
  </div>;
}

export default connect(state => {
  return {
    tokens: state.tokens,
  };
}, dispatch => {
  return {}
})(TokenList);
