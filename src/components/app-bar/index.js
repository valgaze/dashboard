import React from 'react';
import classnames from 'classnames';
import colorVariables from '@density/ui/variables/colors';

import {
  IconGlobe,
  IconStopWatch,
  IconCopy,
} from '@density/ui-icons';

function AppBarItem({isSelected, path, icon, name}) {
  const selected = isSelected();
  const Icon = icon;
  return (
    <li className={classnames('app-bar-item', { selected })}>
      <a href={path}>
        <span className="app-bar-icon">
          {selected ? <Icon color={colorVariables.brandPrimary} /> : <Icon />}
        </span>
        {name}
      </a>
    </li>
  );
}

export default function Appbar({page, onLogout, loggedIn}) {
  return (
    <div className="app-bar-container">
      <div className="app-bar">
        <ul className="app-bar-left">
          <AppBarItem
            isSelected={() => ['DASHBOARD_LIST', 'DASHBOARD_DETAIL'].includes(page)}
            path="#/dashboards"
            icon={IconCopy}
            name="Dashboards"
          />
          <AppBarItem
            isSelected={() => ['EXPLORE_SPACE_LIST', 'EXPLORE_SPACE_DETAIL'].includes(page)}
            path="#/spaces/explore"
            icon={IconGlobe}
            name="Explore"
          />
          <AppBarItem
            isSelected={() => ['LIVE_SPACE_LIST', 'LIVE_SPACE_DETAIL'].includes(page)}
            path="#/spaces/live"
            icon={IconStopWatch}
            name="Live"
          />
          <AppBarItem
            isSelected={() => ['DEV_TOKEN_LIST', 'DEV_WEBHOOK_LIST'].includes(page)}
            path="#/dev/tokens"
            icon={IconCopy}
            name="Developer"
          />
        </ul>
      </div>
    </div>
  );
}
