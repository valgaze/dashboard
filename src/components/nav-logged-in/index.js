import * as React from 'react';

import Navbar, { NavbarItem, NavbarMobileItem } from '@density/ui-navbar';

import stringToBoolean from '../../helpers/string-to-boolean/index';


export default function NavLoggedIn({
  settings,
  activePage,
  user,

  onLogout,
}) {
  return <Navbar mobileSidebar={closeSidebar => [
    <NavbarMobileItem
      activePage={activePage}
      pageName={[
        'ACCOUNT_SETUP_OVERVIEW',
        'ACCOUNT_SETUP_DOORWAY_LIST',
        'ACCOUNT_SETUP_DOORWAY_DETAIL',
      ]}
      href="#/onboarding/overview"
      onClick={closeSidebar}

      // Lock the onboarding page in the demo account.
      locked={user.data && user.data.isDemo}
      lockedReason="Onboarding is unavailable in the demo account."
    >Onboarding</NavbarMobileItem>,

    <NavbarMobileItem
      activePage={activePage}
      pageName={['ACCOUNT_SETUP_OVERVIEW']}
      href="#/onboarding/overview"
      indent={2}
      onClick={closeSidebar}
    >Overview</NavbarMobileItem>,
    <NavbarMobileItem
      activePage={activePage}
      pageName={['ACCOUNT_SETUP_DOORWAY_LIST']}
      href="#/onboarding/doorways"
      indent={2}
      onClick={closeSidebar}
    >Doorways</NavbarMobileItem>,

    <NavbarMobileItem
      activePage={activePage}
      pageName={['INSIGHTS_SPACE_LIST', 'VISUALIZATION_SPACE_DETAIL', 'INSIGHTS_SPACE_TRENDS']}

      // Feature flag: Do not allow the user to visit the insights page until it has been
      // unlocked. During the onboarding process, the organization will not have spaces / doorways
      // so this page does not make sense.
      locked={stringToBoolean(settings.insightsPageLocked)}
      href="#/spaces/insights"
      onClick={closeSidebar}
    >Insights</NavbarMobileItem>,

    <NavbarMobileItem
      activePage={activePage}
      pageName={['LIVE_SPACE_LIST']}
      href="#/spaces/live"
      onClick={closeSidebar}
    >
      Live
      <span className="nav-logged-in-beta">(Beta)</span>
    </NavbarMobileItem>,

    /* Feature flag: Don't show the environment page by default, but when a flag is enabled show it. */
    stringToBoolean(settings.environmentPageVisible) ? <NavbarMobileItem
      activePage={activePage}
      pageName={['ENVIRONMENT_SPACE']}
      href="#/environment/spaces"
      onClick={closeSidebar}
    >Environment</NavbarMobileItem> : null,

    <NavbarMobileItem
      activePage={activePage}
      pageName={['DEV_TOKEN_LIST', 'DEV_WEBHOOK_LIST']}
      href="#/dev/tokens"
      onClick={closeSidebar}
    >Developer Tools</NavbarMobileItem>,

    <NavbarMobileItem
      activePage={activePage}
      pageName={['DEV_TOKEN_LIST']}
      href="#/dev/tokens"
      indent={2}
      onClick={closeSidebar}
    >Tokens</NavbarMobileItem>,
    <NavbarMobileItem
      activePage={activePage}
      pageName={['DEV_WEBHOOK_LIST']}
      href="#/dev/webhooks"
      indent={2}
      onClick={closeSidebar}
    >Webhooks</NavbarMobileItem>,
    <NavbarMobileItem
      activePage={activePage}
      pageName={[]}
      href="http://docs.density.io"
      indent={2}
    >API Documentation</NavbarMobileItem>,

    <NavbarMobileItem
      activePage={activePage}
      pageName={['ACCOUNT']}
      href="#/account"
      onClick={closeSidebar}
    >Account</NavbarMobileItem>,

    <NavbarMobileItem
      activePage={activePage}
      pageName={[]}
      onClick={onLogout}
    >Logout</NavbarMobileItem>,
  ]}>
    <NavbarItem
      activePage={activePage}
      pageName={[
        'ACCOUNT_SETUP_OVERVIEW',
        'ACCOUNT_SETUP_DOORWAY_LIST',
        'ACCOUNT_SETUP_DOORWAY_DETAIL',
      ]}
      href="#/onboarding/overview"

      // Lock the onboarding page in the demo account.
      locked={user.data && user.data.isDemo}
      lockedReason="Onboarding is unavailable in the demo account."
    >Onboarding</NavbarItem>

    <NavbarItem
      activePage={activePage}
      pageName={['INSIGHTS_SPACE_LIST', 'VISUALIZATION_SPACE_DETAIL', 'INSIGHTS_SPACE_TRENDS']}

      // Feature flag: Do not allow the user to visit the visualizations page until it has been
      // unlocked. During the onboarding process, the organization will not have spaces / doorways
      // so this page does not make sense.
      locked={stringToBoolean(settings.insightsPageLocked)}
      lockedReason="Insights will be unlocked once your units are configured."

      href="#/spaces/insights"
    >Insights</NavbarItem>

    <NavbarItem
      activePage={activePage}
      pageName={['LIVE_SPACE_LIST']}
      href="#/spaces/live"
    >
      Live
      <span className="nav-logged-in-beta">(Beta)</span>
    </NavbarItem>

    {/* Feature flag: Don't show the environment page by default, but when a flag is enabled show it. */}
    {stringToBoolean(settings.environmentPageVisible) ? <NavbarItem
      activePage={activePage}
      pageName={['ENVIRONMENT_SPACE']}
      href="#/environment/spaces"
    >Environment</NavbarItem> : null}

    <NavbarItem
      activePage={activePage}
      pageName={['DEV_TOKEN_LIST', 'DEV_WEBHOOK_LIST']}
      href="#/dev/tokens"
    >Developer Tools</NavbarItem>
    <NavbarItem
      activePage={activePage}
      pageName={['ACCOUNT']}
      href="#/account"
    >Account</NavbarItem>
    <span aria-label="Logout" title="Logout" className="nav-logged-in-logout">
      <a onClick={onLogout}>&#xe923;</a>
    </span>
  </Navbar>;
}
