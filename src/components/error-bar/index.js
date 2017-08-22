import * as React from 'react';

export default function ErrorBar({message, showRefresh}) {
  return <div className="error-bar">
    <span className="error-bar-message">{message}</span>
    {showRefresh ? <span
      className="error-bar-link"
      onClick={() => window.location.reload()}
    >Refresh</span> : null}
  </div>;
}
