import React from 'react';
import classnames from 'classnames';
import colorVariables from '@density/ui/variables/colors';

import {
  IconDashboards,
  IconGlobe,
  IconStopWatch,
  IconCopy
} from '@density/ui-icons';

function AppNavItem({isSelected, path, icon, name}) {
  const selected = isSelected();
  const Icon = icon;
  return (
    <li className={classnames('app-nav-item', { selected })}>
      <a href={path}>
        {icon ? <span className="app-nav-icon">
          {selected ? <Icon color={colorVariables.brandPrimary} /> : <Icon />}
        </span> : null}
        {name}
      </a>
    </li>
  );
}

export default function AppNav({page, onLogout, loggedIn}) {
  return (
    <div className="app-nav-container">
      <div className="app-nav">
        <ul className="app-nav-left">
          <AppNavItem
            isSelected={() => ['DASHBOARD_LIST', 'DASHBOARD_DETAIL'].includes(page)}
            path="#/dashboards"
            icon={IconDashboards}
            name="Dashboards"
          />
          <AppNavItem
            isSelected={() => ['EXPLORE_SPACE_LIST', 'EXPLORE_SPACE_DETAIL'].includes(page)}
            path="#/spaces/explore"
            icon={IconGlobe}
            name="Explore"
          />
          <AppNavItem
            isSelected={() => ['LIVE_SPACE_LIST', 'LIVE_SPACE_DETAIL'].includes(page)}
            path="#/spaces/live"
            icon={IconStopWatch}
            name="Live"
          />
          <AppNavItem
            isSelected={() => ['DEV_TOKEN_LIST', 'DEV_WEBHOOK_LIST'].includes(page)}
            path="#/dev/tokens"
            icon={IconCopy}
            name="Developer"
          />
          <AppNavItem
            isSelected={() => ['ACCOUNT_SETUP_OVERVIEW', 'ACCOUNT_SETUP_DOORWAY_LIST', 'ACCOUNT_SETUP_DOORWAY_DETAIL'].includes(page)}
            path="#/onboarding"
            icon={IconCopy}
            name="Onboarding"
          />
        </ul>
        <ul className="app-nav-right">
          <AppNavItem
            isSelected={() => false}
            path="#/logout"
            name="Logout"
          />
        </ul>
      </div>
    </div>
  );
}
