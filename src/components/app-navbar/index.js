import React from 'react';
import classnames from 'classnames';
import colorVariables from '@density/ui/variables/colors';

import {
  IconDashboards,
  IconGlobe,
  IconStopWatch,
  IconCopy,
  IconLightning
} from '@density/ui-icons';

import stringToBoolean from '../../helpers/string-to-boolean';

function AppNavbarItem({isSelected, showOnMobile, path, icon, name}) {
  const selected = isSelected();
  const Icon = icon;
  return (
    <li className={classnames('app-navbar-item', { selected, showOnMobile })}>
      <a href={path}>
        {icon ? <span className="app-navbar-icon">
          {selected ? <Icon color={colorVariables.brandPrimaryNew} /> : <Icon />}
        </span> : null}
        {name}
      </a>
    </li>
  );
}

export default function AppNavbar({page, settings}) {
  return (
    <div className="app-navbar-container">
      <div className="app-navbar">
        <ul className="app-navbar-left">
          {stringToBoolean(settings.dashboardEnabled) ? <AppNavbarItem
            isSelected={() => ['DASHBOARD_LIST', 'DASHBOARD_DETAIL'].includes(page)}
            showOnMobile={false}
            path="#/dashboards"
            icon={IconDashboards}
            name="Dashboards"
          /> : null}
          {!stringToBoolean(settings.insightsPageLocked) ? <AppNavbarItem
            isSelected={() => ['EXPLORE_SPACE_LIST', 'EXPLORE_SPACE_DETAIL'].includes(page)}
            showOnMobile={false}
            path="#/spaces/explore"
            icon={IconGlobe}
            name="Explore"
          /> : null}
          <AppNavbarItem
            isSelected={() => ['LIVE_SPACE_LIST', 'LIVE_SPACE_DETAIL'].includes(page)}
            showOnMobile={true}
            path="#/spaces/live"
            icon={IconStopWatch}
            name="Live"
          />
          <AppNavbarItem
            isSelected={() => ['DEV_TOKEN_LIST', 'DEV_WEBHOOK_LIST'].includes(page)}
            showOnMobile={false}
            path="#/dev/tokens"
            icon={IconLightning}
            name="Developer"
          />
          {stringToBoolean(settings.insightsPageLocked) ? <AppNavbarItem
            isSelected={() => ['ACCOUNT_SETUP_OVERVIEW', 'ACCOUNT_SETUP_DOORWAY_LIST', 'ACCOUNT_SETUP_DOORWAY_DETAIL'].includes(page)}
            showOnMobile={true}
            path="#/onboarding"
            icon={IconCopy}
            name="Onboarding"
          /> : null}
        </ul>
        <ul className="app-navbar-right">
          <AppNavbarItem
            isSelected={() => false}
            showOnMobile={true}
            path="#/logout"
            name="Logout"
          />
        </ul>
      </div>
    </div>
  );
}
