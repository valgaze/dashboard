import './polyfill.js';
import 'react-app-polyfill/ie11'; // For IE 11 support

import React from 'react';
import ReactDOM from 'react-dom';
import { unregister as unregisterServiceWorker } from './registerServiceWorker';
import './built-css/styles.css';
import { core, accounts, setStore as setStoreInApiClientModule } from './client';
import ReactGA from 'react-ga';
import moment from 'moment';
import queryString from 'qs';

import '@density/ui-fonts';

import userSet from './actions/user/set';

import objectSnakeToCamel from './helpers/object-snake-to-camel/index';
import WebsocketEventPusher from './helpers/websocket-event-pusher/index';
import mixpanelTrack from './helpers/mixpanel-track/index';
import unsafeHandleWindowResize from './helpers/unsafe-handle-window-resize';
import unsafeNavigateToLandingPage from './helpers/unsafe-navigate-to-landing-page/index';
import unsafeSetSettingsFlagConstructor from './helpers/unsafe-set-settings-flag/index';

// The main app component that renders everything.
import App from './components/app/index';

// The Environment switcher, used to switch between sets of servers that should be communicated
// with.
import EnvironmentSwitcher, { getActiveEnvironments } from './components/environment-switcher/index';

// Redux is used to manage state.
import { Provider } from 'react-redux';
import createRouter from '@density/conduit';

// Import all actions required to navigate from one page to another.
import routeTransitionLogin from './actions/route-transition/login';
import routeTransitionLogout from './actions/route-transition/logout';
import routeTransitionExploreSpaceList from './actions/route-transition/explore-space-list';
import routeTransitionExploreSpaceTrends from './actions/route-transition/explore-space-trends';
import routeTransitionExploreSpaceDaily from './actions/route-transition/explore-space-daily';
import routeTransitionExploreSpaceDataExport from './actions/route-transition/explore-space-data-export';
import routeTransitionLiveSpaceList from './actions/route-transition/live-space-list';
import routeTransitionLiveSpaceDetail from './actions/route-transition/live-space-detail';
import routeTransitionDevTokenList from './actions/route-transition/dev-token-list';
import routeTransitionDevWebhookList from './actions/route-transition/dev-webhook-list';
import routeTransitionAccount from './actions/route-transition/account';
import routeTransitionAccountRegister from './actions/route-transition/account-register';
import routeTransitionAccountForgotPassword from './actions/route-transition/account-forgot-password';
import routeTransitionAccountSetupOverview from './actions/route-transition/account-setup-overview';
import routeTransitionAccountSetupDoorwayList from './actions/route-transition/account-setup-doorway-list';
import routeTransitionAccountSetupDoorwayDetail from './actions/route-transition/account-setup-doorway-detail';
import routeTransitionDashboardList from './actions/route-transition/dashboard-list';
import routeTransitionDashboardDetail from './actions/route-transition/dashboard-detail';
import routeTransitionExploreNewDetail from './actions/route-transition/explore-new-detail';

import redirectAfterLogin from './actions/miscellaneous/redirect-after-login';
import collectionSpacesCountChange from './actions/collection/spaces/count-change';
import collectionSpacesSetEvents from './actions/collection/spaces/set-events';
import collectionSpacesSet from './actions/collection/spaces/set';

import eventPusherStatusChange from './actions/event-pusher/status-change';

// All the reducer and store code is in a seperate file.
import storeFactory from './store';
const store = storeFactory();

// ----------------------------------------------------------------------------
// Set the location of all microservices.
// Here's how it works:
// ----------------------------------------------------------------------------
//
// 1. All microservice names and cofigurations are defined in `fields`. `setServiceLocations` is
// called, passing the active environment names. By setting this initially before the react render
// happens, calls that happen before the render are able to take advantage of the custom
// environments that have been defined.
//
// 2. Developer opens the environment switcher modal, changes an environment variable, then clicks
// "ok". The `EnvironmentSwitcher` component's `onChange` is fired, which calls
// `setServiceLocations`. The locations of all the services update.
//

const fields = [
  {
    name: 'Core API',
    slug: 'core',
    defaults: {
      'production': 'https://api.density.io/v2',
      'staging': 'https://core-staging.density.io/v2',
      'local': 'http://localhost:8000/v2',
      'env (REACT_APP_CORE_API_URL)': process.env.REACT_APP_CORE_API_URL,
    },
    default: process.env.REACT_APP_ENVIRONMENT || 'production',
  },
  {
    name: 'Accounts API',
    slug: 'accounts',
    defaults: {
      'production': 'https://accounts.density.io/v1',
      'staging': 'https://accounts-staging.density.io/v1',
      'local': 'http://localhost:8001/v1',
      'env (REACT_APP_ACCOUNTS_API_URL)': process.env.REACT_APP_ACCOUNTS_API_URL,
    },
    default: process.env.REACT_APP_ENVIRONMENT || 'production',
  },
];
function setServiceLocations(data) {
  core.config({core: data.core});
  accounts.config({host: data.accounts});
}
setServiceLocations(getActiveEnvironments(fields)); /* step 1 above */


// Send metrics to google analytics and mixpanel when the page url changes.
if (process.env.REACT_APP_GA_TRACKING_CODE) {
  ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_CODE);
}
function trackHashChange() {
  // Any query parameters in the below list will be sent to google analytics and mixpanel
  const qs = queryString.parse(window.location.search);
  const analyticsParameters = [
    'ref',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
  ].reduce((acc, tag) => {
    const value = qs[`?${tag}`] || qs[tag];
    if (value) {
      return {...acc, [tag]: value};
    } else {
      return acc;
    }
  }, {});

  // Mixpanel: track url chage
  mixpanelTrack('Pageview', {
    ...analyticsParameters,
    url: window.location.hash,
  });

  // Google analytics: track page view
  if (process.env.REACT_APP_GA_TRACKING_CODE) {
    ReactGA.pageview(window.location.hash);
    ReactGA.set(analyticsParameters);
  }
};
window.addEventListener('hashchange', trackHashChange);
trackHashChange();

// Routing helper to redirect to a different url when a user visits a url.
function redirect(url) {
  return (...args) => {
    if (typeof url === 'function') {
      window.location.href = `#/${url(...args)}`;
    } else {
      window.location.href = `#/${url}`;
    }
    // FIXME: Conduit shouldn't dispatch an action if a function returns undefined. That would let the
    // below line be removed.
    return {type: 'NOOP'};
  }
}


// Create a router to listen to the store and dispatch actions when the hash changes.
// Uses conduit, an open source router we made at Density: https://github.com/DensityCo/conduit
const router = createRouter(store);
router.addRoute('login', () => routeTransitionLogin());
router.addRoute('logout', () => routeTransitionLogout());

// v I AM DEPRECATED
router.addRoute('insights/spaces', redirect('spaces/explore')); // DEPRECATED
router.addRoute('spaces/insights/:id', redirect(id => `spaces/explore/${id}/trends`)); // DEPRECATED
router.addRoute('spaces/insights', redirect(`spaces/explore`)); // DEPRECATED
router.addRoute('spaces/insights/:id/trends', redirect(id => `spaces/explore/${id}/trends`)); // DEPRECATED
router.addRoute('spaces/insights/:id/daily', redirect(id => `spaces/explore/${id}/daily`)); // DEPRECATED
router.addRoute('spaces/insights/:id/data-export', redirect(id => `spaces/explore/${id}/data-export`)); // DEPRECATED
// ^ I AM DEPRECATED

router.addRoute('dashboards', () => routeTransitionDashboardList());
router.addRoute('dashboards/:id', id => routeTransitionDashboardDetail(id));

router.addRoute('explore-new', () => routeTransitionExploreNewDetail([]));
router.addRoute('explore-new/:ids', (ids) => routeTransitionExploreNewDetail(ids.split(',')));

router.addRoute('spaces/explore', () => routeTransitionExploreSpaceList());
router.addRoute('spaces/explore/:id/trends', id => routeTransitionExploreSpaceTrends(id));
router.addRoute('spaces/explore/:id/daily', id => routeTransitionExploreSpaceDaily(id));
router.addRoute('spaces/explore/:id/data-export', id => routeTransitionExploreSpaceDataExport(id));

router.addRoute('spaces/live', () => routeTransitionLiveSpaceList());
router.addRoute('spaces/live/:id', id => routeTransitionLiveSpaceDetail(id));

router.addRoute('dev/tokens', () => routeTransitionDevTokenList());
router.addRoute('dev/webhooks', () => routeTransitionDevWebhookList());

router.addRoute('account', () => routeTransitionAccount());

// User registration and password resetting
router.addRoute('account/register/:slug', slug => routeTransitionAccountRegister(slug));
router.addRoute('account/forgot-password/:token', token => routeTransitionAccountForgotPassword(token));

// Onboarding flow
// Redirect #/onboarding => #/onboarding/overview
router.addRoute('onboarding', redirect('onboarding/overview'));
router.addRoute('onboarding/overview', () => routeTransitionAccountSetupOverview());
router.addRoute('onboarding/doorways', () => routeTransitionAccountSetupDoorwayList());
router.addRoute('onboarding/doorways/:id', id => routeTransitionAccountSetupDoorwayDetail(id));

// Make sure that the user is logged in prior to going to a page.
function preRouteAuthentication() {
  const loggedIn = store.getState().sessionToken !== null;

  // If on the account registration page (the only page that doesn't require the user to be logged in)
  // then don't worry about any of this.
  if (
    window.location.hash.startsWith("#/account/register") ||
    window.location.hash.startsWith("#/account/forgot-password")
  ) {
    return;

  // If the user isn't logged in, send them to the login page.
  } else if (!loggedIn) {
    store.dispatch(redirectAfterLogin(window.location.hash));
    router.navigate('login');

  // Otherwise, fetch the logged in user's info since there's a session token available.
  } else {
    // Look up the user info before we can redirect to the landing page.
    return accounts.users.me().then(user => {
      if (user) {
        // A valid user object was returned, so add it to the store.
        store.dispatch(userSet(user));

        // Then, navigate the user to the landing page.
        unsafeNavigateToLandingPage(objectSnakeToCamel(user).organization.settings);
      } else {
        // User token expired (and no user object was returned) so redirect to login page.
        store.dispatch(redirectAfterLogin(window.location.hash));
        router.navigate('login');
      }
    });
  }
}
setStoreInApiClientModule(store);
preRouteAuthentication();

// Add a helper into the global namespace to allow changing of settings flags on the fly.
window.setSettingsFlag = unsafeSetSettingsFlagConstructor(store);

// Add a handler to debounce & handle window resize events
window.resizeHandler = unsafeHandleWindowResize(store);

// Handle the route that the user is currently at.
router.handle();


// ----------------------------------------------------------------------------
// Real time event source
// Listen in real time for pushed events via websockets. When we receive
// events, dispatch them as actions into the system.
// ----------------------------------------------------------------------------
const eventSource = new WebsocketEventPusher();

// Reconnect to the socket when the token changes.
let currentToken = null;
store.subscribe(() => {
  const newToken = store.getState().sessionToken;
  if (newToken !== currentToken) {
    currentToken = newToken;
    eventSource.connect();
  }
});

// When the state of the connection changes, sync that change into redux.
eventSource.on('connectionStateChange', newConnectionState => {
  store.dispatch(eventPusherStatusChange(newConnectionState));
});

// When the event source disconnects, fetch the state of each space from the core api to ensure that
// the dashboard hasn't missed any events.
eventSource.on('connected', async () => {
  const spaces = await core.spaces.list();
  store.dispatch(collectionSpacesSet(spaces.results));

  const spaceEventSets = await Promise.all(spaces.results.map(space => {
    return core.spaces.events({
      id: space.id,
      start_time: moment.utc().subtract(1, 'minute').format(),
      end_time: moment.utc().format(),
    });
  }));

  spaceEventSets.forEach((spaceEventSet, ct) => {
    const action = collectionSpacesSetEvents(
      spaces.results[ct],
      spaceEventSet.results.map(i => ({ countChange: i.direction, timestamp: i.timestamp }))
    );
    store.dispatch(action);
  });
});

eventSource.on('space', countChangeEvent => {
  store.dispatch(collectionSpacesCountChange({
    id: countChangeEvent.spaceId,
    timestamp: countChangeEvent.timestamp,
    // In v2, the API uses "direction" to for a count change, due to a traffic event, at a space.
    // In the future "count change" should refer to ANY count change at a space, including resets.
    // TODO: The UI does not show "live" resets, so review other instances of `countChange`.
    countChange: countChangeEvent.direction,
  }));
});

// If the user is logged in, sync the count of all spaces with the server every 5 minutes.
// This is to ensure that the count on the dashboard and the actual count can't drift really far
// apart throughout the day if you don't refresh the dashboard.
setInterval(async () => {
  const loggedIn = store.getState().sessionToken !== null;

  if (loggedIn) {
    const spaces = await core.spaces.list();
    store.dispatch(collectionSpacesSet(spaces.results));
  }
},  5 * 60 * 1000);

ReactDOM.render(
  <Provider store={store}>
    <div>
      <App />

      <EnvironmentSwitcher
        keys={['!', '!', '`', ' ']} // Press '!!` ' to open environment switcher.
        fields={fields}
        onChange={setServiceLocations}
      />
    </div>
  </Provider>,
  document.getElementById('root')
);

unregisterServiceWorker();
