import * as React from 'react';
import * as classnames from 'classnames';

export default function TokenCard({
  token,
  tokenType,
}) {
  return <div className={classnames('token-card', {
    'token-card-read-only': tokenType === 'readonly',
    'token-card-read-write': tokenType === 'readwrite',
  })}>
    <h2>Token</h2>
    <div className="token-card-body">
      {token}
    </div>
  </div>;
}
