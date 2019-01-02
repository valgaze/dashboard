import * as React from 'react';
import classnames from 'classnames';

export default function Subnav({children, visible = false}) {
  return <div className={classnames('subnav', {'subnav-visible': visible})}>
    <ul className="subnav-items">{children}</ul>
  </div>;
}

export function SubnavItem({href, active = false, external = false, children}) {
  return <li className={classnames(`subnav-item`, {active, external})}>
    <a target={external ? '_blank' : '_self'} href={href}>
      {children}
    </a>
  </li>;
}
