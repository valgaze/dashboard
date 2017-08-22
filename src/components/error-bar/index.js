import * as React from 'react';

export default function ErrorBar({message, showRefresh}) {
  if (message) {
    return <div className="error-bar error-bar-visible">
      <span className="error-bar-message">{message instanceof Error ? message.message : message}</span>
      {showRefresh ? <span
        className="error-bar-link"
        onClick={() => window.location.reload()}
      >Refresh</span> : null}
    </div>;
  } else {
    return <div className="error-bar error-bar-empty" />;
  }
}
