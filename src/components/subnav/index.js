import * as React from 'react';
import classnames from 'classnames';

export default function Subnav({children, visible}) {
  return <div className={classnames('subnav', {'subnav-visible': visible})}>
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
