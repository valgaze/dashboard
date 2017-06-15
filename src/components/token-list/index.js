import * as React from 'react';

export default function TokenList({
  name,
}) {
  return <div className="token-list">
    {name ? `Hello ${name}` : 'Hello World!'}
  </div>;
}
