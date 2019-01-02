import React from 'react';
import classnames from 'classnames';

export default function AppSidebar({ visible, children }) {
  return <div className={classnames('app-sidebar-collapser', {visible: visible})}>
    <div className="app-sidebar">{children}</div>
  </div>;
}
