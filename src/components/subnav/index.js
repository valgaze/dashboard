import * as React from 'react';
import classnames from 'classnames';

export default function Subnav({children}) {
  return <div className="subnav">
    <ul className="subnav-items">{children}</ul>
  </div>;
}

export function SubnavItem({href, active, external, children}) {
  return <li className={classnames(`subnav-item`, {active, external})}>
    <a target={external ? '_blank' : '_self'} href={href}>
      {children}
    </a>
  </li>;
}
