import React from 'react';
import classnames from 'classnames';
import colorVariables from '@density/ui/variables/colors';

import {
  IconGlobe,
  IconStopWatch,
  IconCopy,
  IconLogout
} from '@density/ui-icons';

function AppBarItem({isSelected, path, icon, name}) {
  const selected = isSelected();
  const Icon = icon;
  return (
    <li className={classnames('app-bar-item', { selected })}>
      <a href={path}>
        {icon ? <span className="app-bar-icon">
          {selected ? <Icon color={colorVariables.brandPrimary} /> : <Icon />}
        </span> : null}
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
          <AppBarItem
            isSelected={() => ['ACCOUNT_SETUP_OVERVIEW', 'ACCOUNT_SETUP_DOORWAY_LIST', 'ACCOUNT_SETUP_DOORWAY_DETAIL'].includes(page)}
            path="#/onboarding"
            icon={IconCopy}
            name="Onboarding"
          />
        </ul>
        <ul className="app-bar-right">
          <AppBarItem
            isSelected={() => false}
            path="#/logout"
            name="Logout"
          />
        </ul>
      </div>
    </div>
  );
}
