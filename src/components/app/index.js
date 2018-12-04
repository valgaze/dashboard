import React from 'react';

import stringToBoolean from '../../helpers/string-to-boolean/index';
import sessionTokenUnset from '../../actions/session-token/unset';
import collectionSpacesSet from '../../actions/collection/spaces/set';
import collectionDoorwaysSet from '../../actions/collection/doorways/set';
import collectionLinksSet from '../../actions/collection/links/set';

import { connect } from 'react-redux';

import NavLoggedOut from '../nav-logged-out/index';
import TokenList from '../dev-token-list/index';
import ExploreSpaceList from '../explore-space-list/index';
import ExploreSpaceTrends from '../explore-space-trends/index';
import ExploreSpaceDaily from '../explore-space-daily/index';
import ExploreSpaceDataExport from '../explore-space-data-export/index';
import Login from '../login/index';
import Account from '../account/index';
import WebhookList from '../dev-webhook-list/index';
import AccountRegistration from '../account-registration/index';
import AccountForgotPassword from '../account-forgot-password/index';
import LiveSpaceList from '../live-space-list/index';
import LiveSpaceDetail from '../live-space-detail/index';

import AccountSetupOverview from '../account-setup-overview/index';
import AccountSetupDoorwayList from '../account-setup-doorway-list/index';
import AccountSetupDoorwayDetail from '../account-setup-doorway-detail/index';

import Dashboard from '../dashboard/index';
import AppBar from '../app-bar/index';

import UnknownPage from '../unknown-page/index';

function App({activePage, settings, user, onLogout}) {
  return (
    <div className="app">
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
          return <AppBar
            page={activePage}
            onLogout={onLogout}
            user={user}
          />;
        }
      })(activePage)}

      {/* Insert the currently displayed page into the view */}
      <ActivePage
        activePage={activePage}
        settings={settings}
      />
    </div>
  );
}

function ActivePage({activePage, settings}) {
  switch (activePage) {
  case "LOGIN":
    return <Login />;
  case "LIVE_SPACE_LIST":
    return stringToBoolean(settings.insightsPageLocked) ? null : <LiveSpaceList />;
  case "LIVE_SPACE_DETAIL":
    return <LiveSpaceDetail />;
  case "EXPLORE_SPACE_LIST":
    return <ExploreSpaceList />;
  case "EXPLORE_SPACE_TRENDS":
    return stringToBoolean(settings.insightsPageLocked) ? null : <ExploreSpaceTrends />;
  case "EXPLORE_SPACE_DAILY":
    return stringToBoolean(settings.insightsPageLocked) ? null : <ExploreSpaceDaily />;
  case "EXPLORE_SPACE_DATA_EXPORT":
    return stringToBoolean(settings.insightsPageLocked) ? null : <ExploreSpaceDataExport />;
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
  case "DASHBOARD_DETAIL":
    return <Dashboard />;
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
      dispatch(collectionSpacesSet([]));
      dispatch(collectionDoorwaysSet([]));
      dispatch(collectionLinksSet([]));
      window.location.hash = '#/login';
    },
  }
})(App);
