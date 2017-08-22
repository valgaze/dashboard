import * as React from 'react';
import classnames from 'classnames';

export default function ErrorBar({message, showRefresh, modalOpen}) {
  if (message) {
    return <div className={classnames(
      'error-bar',
      'error-bar-visible',
      modalOpen ? 'error-bar-over-modal' : null
    )}>
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
