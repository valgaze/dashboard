import * as React from 'react';

import stringToBoolean from '../../helpers/string-to-boolean/index';
import sessionTokenUnset from '../../actions/session-token/unset';

import { connect } from 'react-redux';

import NavLoggedIn from '../nav-logged-in/index';
import NavLoggedOut from '../nav-logged-out/index';
import TokenList from '../dev-token-list/index';
import InsightsSpaceList from '../insights-space-list/index';
import SpaceDetail from '../visualization-space-detail/index';
import Login from '../login/index';
import Environment from '../environment/index';
import Account from '../account/index';
import WebhookList from '../dev-webhook-list/index';
import AccountRegistration from '../account-registration/index';
import AccountForgotPassword from '../account-forgot-password/index';
import LiveSpaceList from '../live-space-list/index';
import LiveSpaceDetail from '../live-space-detail/index';

import AccountSetupOverview from '../account-setup-overview/index';
import AccountSetupDoorwayList from '../account-setup-doorway-list/index';
import AccountSetupDoorwayDetail from '../account-setup-doorway-detail/index';

import UnknownPage from '../unknown-page/index';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import MultiBackend, { TouchTransition, Preview } from 'react-dnd-multi-backend';

function AppComponent({activePage, settings, user, onLogout}) {
  return <div className="app">
    {/* Render the navbar */}
    {(function(activePage) {
      switch (activePage) {
        // On these special pages, render the logged-out navbar.
        case 'LOGIN':
        case 'ACCOUNT_REGISTRATION':
        case 'ACCOUNT_FORGOT_PASSWORD':
          return <NavLoggedOut />;

        // Don't render a nav bar on this special page.
        case 'LIVE_SPACE_DETAIL':
          return null;

        // Render the logged-in navbar by default
        default:
          return <NavLoggedIn
            activePage={activePage}
            settings={settings}
            onLogout={onLogout}
            user={user}
          />;
      }
    })(activePage)}

    {/* Render dragging preview when an item is being dragged */}
    <Preview generator={(type, item, style) => <div style={style} />} />

    {/* Insert the currently displayed page into the view */}
    <ActivePage activePage={activePage} settings={settings} />
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

function ActivePage({activePage, settings}) {
  switch (activePage) {
  case "LOGIN":
    return <Login />;
  case "LIVE_SPACE_LIST":
    return stringToBoolean(settings.insightsPageLocked) ? null : <LiveSpaceList />;
  case "LIVE_SPACE_DETAIL":
    return <LiveSpaceDetail />;
  case "INSIGHTS_SPACE_LIST":
    return <InsightsSpaceList />;
  case "VISUALIZATION_SPACE_DETAIL":
    return stringToBoolean(settings.insightsPageLocked) ? null : <SpaceDetail />;
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
  default:
    return <UnknownPage invalidUrl={activePage} />;
  }
}


export default connect(state => {
  return {
    activePage: state.activePage,
    settings: (
      state.user &&
      state.user.data &&
      state.user.data.organization &&
      state.user.data.organization.settings
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
