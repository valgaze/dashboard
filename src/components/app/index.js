import * as React from 'react';
import Navbar, { NavbarItem, NavbarMobileItem } from '@density/ui-navbar';

import sessionTokenUnset from '../../actions/session-token/unset';

import { connect } from 'react-redux';

import featureFlagEnabled from '../../helpers/feature-flag-enabled/index';

import TokenList from '../dev-token-list/index';
import SpaceList from '../visualization-space-list/index';
import SpaceDetail from '../visualization-space-detail/index';
import Login from '../login/index';
import Environment from '../environment/index';
import Pilot from '../pilot/index';
import Account from '../account/index';
import WebhookList from '../dev-webhook-list/index';
import AccountRegistration from '../account-registration/index';
import AccountForgotPassword from '../account-forgot-password/index';

import AccountSetupOverview from '../account-setup-overview/index';
import AccountSetupDoorwayList from '../account-setup-doorway-list/index';
import AccountSetupDoorwayDetail from '../account-setup-doorway-detail/index';

import UnknownPage from '../unknown-page/index';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import MultiBackend, { TouchTransition, Preview } from 'react-dnd-multi-backend';


function NavbarWrapper({
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
      href="#/account/setup/overview"
      onClick={closeSidebar}
    >Unit Setup</NavbarMobileItem>,

    <NavbarMobileItem
      activePage={activePage}
      pageName={['ACCOUNT_SETUP_OVERVIEW']}
      href="#/account/setup/overview"
      indent={2}
      onClick={closeSidebar}
    >Overview</NavbarMobileItem>,
    <NavbarMobileItem
      activePage={activePage}
      pageName={['ACCOUNT_SETUP_DOORWAY_LIST']}
      href="#/account/setup/doorways"
      indent={2}
      onClick={closeSidebar}
    >Doorways</NavbarMobileItem>,

    <NavbarMobileItem
      activePage={activePage}
      pageName={['VISUALIZATION_SPACE_LIST', 'VISUALIZATION_SPACE_DETAIL']}

      // Feature flag: Do not allow the user to visit the visualizations page until it has been
      // unlocked. During the onboarding process, the organization will not have spaces / doorways
      // so this page does not make sense.
      locked={featureFlagEnabled(settings.visualizationPageLocked)}
      href="#/insights/spaces"
      onClick={closeSidebar}
    >Insights</NavbarMobileItem>,

    /* Feature flag: Don't show the environment page by default, but when a flag is enabled show it. */
    featureFlagEnabled(settings.environmentPageVisible) ? <NavbarMobileItem
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
      href="#/account/setup/overview"
    >Unit Setup</NavbarItem>

    <NavbarItem
      activePage={activePage}
      pageName={['VISUALIZATION_SPACE_LIST', 'VISUALIZATION_SPACE_DETAIL']}

      // Feature flag: Do not allow the user to visit the visualizations page until it has been
      // unlocked. During the onboarding process, the organization will not have spaces / doorways
      // so this page does not make sense.
      locked={featureFlagEnabled(settings.visualizationPageLocked)}
      href="#/insights/spaces"
    >Insights</NavbarItem>

    {/* Feature flag: Don't show the environment page by default, but when a flag is enabled show it. */}
    {featureFlagEnabled(settings.environmentPageVisible) ? <NavbarItem
      activePage={activePage}
      pageName={['ENVIRONMENT_SPACE']}
      href="#/environment/spaces"
    >Environment</NavbarItem> : null}
    
    {user.user && user.user.organization && user.user.organization.id === 'org_162164766972838168NOSHOW' ?  <NavbarItem
      activePage={activePage}
      pageName={['PILOT']}
      href="#/pilot"
    >Pilot</NavbarItem> : null}

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
    <span aria-label="Logout" title="Logout" className="navbar-item-logout">
      <a onClick={onLogout}>&#xe923;</a>
    </span>
  </Navbar>;
}

function AppComponent({activePage, settings, user, onLogout}) {
  return <div className="app">
    {/* Render the navbar */}
    {(
      activePage !== 'LOGIN' &&
      activePage !== 'ACCOUNT_REGISTRATION' &&
      activePage !== 'ACCOUNT_FORGOT_PASSWORD'
    ) ? <NavbarWrapper
      activePage={activePage}
      settings={settings}
      onLogout={onLogout}
      user={user}
    /> : null}

    {/* Render dragging preview when an item is being dragged */}
    <Preview generator={(type, item, style) => <div style={style} />} />

    {/* Insert the currently displayed page into the view */}
    <ActivePage activePage={activePage} />
  </div>;
}
const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend,
    },
    {
      backend: TouchBackend({enableMouseEvents: true}),
      preview: true,
      transition: TouchTransition,
    },
  ],
};
const App = DragDropContext(MultiBackend(HTML5toTouch))(AppComponent);

function ActivePage({activePage}) {
  switch (activePage) {
  case "LOGIN":
    return <Login />;
  case "VISUALIZATION_SPACE_LIST":
    return <SpaceList />;
  case "VISUALIZATION_SPACE_DETAIL":
    return <SpaceDetail />;
  case "ENVIRONMENT_SPACE":
    return <Environment />;
  case "ACCOUNT":
    return <Account />;
  case "DEV_WEBHOOK_LIST":
    return <WebhookList />;
  case "DEV_TOKEN_LIST":
    return <TokenList />;
  case "ACCOUNT_REGISTRATION":
    return <AccountRegistration />;
  case "ACCOUNT_FORGOT_PASSWORD":
    return <AccountForgotPassword />;
  case "ACCOUNT_SETUP_OVERVIEW":
    return <AccountSetupOverview />;
  case "ACCOUNT_SETUP_DOORWAY_LIST":
    return <AccountSetupDoorwayList />;
  case "ACCOUNT_SETUP_DOORWAY_DETAIL":
    return <AccountSetupDoorwayDetail />;
  case "PILOT":
    return <Pilot />;
  default:
    return <UnknownPage invalidUrl={activePage} />;
  }
}


export default connect(state => {
  return {
    activePage: state.activePage,
    settings: (
      state.user &&
      state.user.user &&
      state.user.user.organization &&
      state.user.user.organization.settings
    ) || {},
    user: state.user
  };
}, dispatch => {
  return {
    onLogout() {
      dispatch(sessionTokenUnset());
      window.location.hash = '#/login';
    },
  }
})(App);
