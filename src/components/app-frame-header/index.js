import React from 'react';
import classnames from 'classnames';

export default function AppFrameHeader({children, color}) {
  return (
    <div className="app-frame-header" style={{backgroundColor: color}}>
      {children}
    </div>
  );
}

export function AppFrameHeaderItem({children, noLeftSpace, noRightSpace}) {
  return (
    <div className={classnames('app-frame-header-item', {
      'left-space': !noLeftSpace,
      'right-space': !noRightSpace,
    })}>
      {children}
    </div>
  );
}

export function AppFrameHeaderText({children}) {
  return (
    <span className="app-frame-header-text">
      {children}
    </span>
  );
}
