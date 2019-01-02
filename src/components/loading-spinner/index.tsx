import * as React from 'react';
import classnames from 'classnames';

export default function LoadingSpinner({className = null}) {
  return <div className={classnames('loading-spinner-container', className)}>
    <img
      src="https://densityco.github.io/assets/images/loader.a9e9beed.gif"
      alt=""
      className="loading-spinner"
    />
  </div>
}
