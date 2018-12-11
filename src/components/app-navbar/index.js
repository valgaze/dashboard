import React from 'react';
import classnames from 'classnames';
import colorVariables from '@density/ui/variables/colors';

import {
  IconDashboards,
  IconGlobe,
  IconStopWatch,
  IconCopy
} from '@density/ui-icons';

function AppNavbarItem({isSelected, path, icon, name}) {
  const selected = isSelected();
  const Icon = icon;
  return (
    <li className={classnames('app-navbar-item', { selected })}>
      <a href={path}>
        {icon ? <span className="app-navbar-icon">
          {selected ? <Icon color={colorVariables.brandPrimary} /> : <Icon />}
        </span> : null}
        {name}
      </a>
    </li>
  );
}

export default function AppNavbar({page, onLogout, loggedIn}) {
  return (
    <div className="app-navbar-container">
      <div className="app-navbar">
        <ul className="app-navbar-left">
          <AppNavbarItem
            isSelected={() => ['DASHBOARD_LIST', 'DASHBOARD_DETAIL'].includes(page)}
            path="#/dashboards"
            icon={IconDashboards}
            name="Dashboards"
          />
          <AppNavbarItem
            isSelected={() => ['EXPLORE_SPACE_LIST', 'EXPLORE_SPACE_DETAIL'].includes(page)}
            path="#/spaces/explore"
            icon={IconGlobe}
            name="Explore"
          />
          <AppNavbarItem
            isSelected={() => ['LIVE_SPACE_LIST', 'LIVE_SPACE_DETAIL'].includes(page)}
            path="#/spaces/live"
            icon={IconStopWatch}
            name="Live"
          />
          <AppNavbarItem
            isSelected={() => ['DEV_TOKEN_LIST', 'DEV_WEBHOOK_LIST'].includes(page)}
            path="#/dev/tokens"
            icon={IconCopy}
            name="Developer"
          />
          <AppNavbarItem
            isSelected={() => ['ACCOUNT_SETUP_OVERVIEW', 'ACCOUNT_SETUP_DOORWAY_LIST', 'ACCOUNT_SETUP_DOORWAY_DETAIL'].includes(page)}
            path="#/onboarding"
            icon={IconCopy}
            name="Onboarding"
          />
        </ul>
        <ul className="app-navbar-right">
          <AppNavbarItem
            isSelected={() => false}
            path="#/logout"
            name="Logout"
          />
        </ul>
      </div>
    </div>
  );
}
