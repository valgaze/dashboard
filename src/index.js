import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './built-css/styles.css';
import { core, accounts } from '@density-int/client';

import userSet from './actions/user/set';
import userError from './actions/user/error';
import sessionTokenUnSet from './actions/session-token/unset';

import eventSource from './helpers/websocket-event-pusher/index';

// The main app component that renders everything.
import App from './components/app/index';

// The Environment switcher, used to switch between sets of servers that should be communicated
// with.
import EnvironmentSwitcher, { getActiveEnvironments } from './components/environment-switcher/index';

// Redux is used to manage state.
import { Provider } from 'react-redux';
import createRouter from '@density/conduit';

// Import all actions required to navigate from one page to another.
import routeTransitionEnvironmentSpace from './actions/route-transition/environment-space';
import routeTransitionLogin from './actions/route-transition/login';
import routeTransitionVisualizationSpaceDetail from './actions/route-transition/visualization-space-detail';
import routeTransitionVisualizationSpaceList from './actions/route-transition/visualization-space-list';
import routeTransitionDevTokenList from './actions/route-transition/dev-token-list';
import routeTransitionDevWebhookList from './actions/route-transition/dev-webhook-list';
import routeTransitionAccount from './actions/route-transition/account';
import routeTransitionAccountRegister from './actions/route-transition/account-register';
import routeTransitionAccountForgotPassword from './actions/route-transition/account-forgot-password';

import collectionSpacesCountChange from './actions/collection/spaces/count-change';

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
      'Production': 'https://api.density.io/v2',
      'Local': 'http://localhost:8000/v2',
      'Env (REACT_APP_CORE_API_URL)': process.env.REACT_APP_CORE_API_URL,
    },
    default: 'Production',
  },
  {
    name: 'Accounts API',
    slug: 'accounts',
    defaults: {
      'Production': 'https://clerk.density.io/v1',
      'Local': 'http://localhost:8001/v1',
      'Env (REACT_APP_ACCOUNTS_API_URL)': process.env.REACT_APP_ACCOUNTS_API_URL,
    },
    default: 'Production',
  },
  {
    name: 'Event source (websockets server)',
    slug: 'eventsource',
    defaults: {
      'None': 'false',
      'Production': 'wss://socket.density.io',
      'Local': 'ws://localhost:8080',
      'Env (REACT_APP_EVENTSOURCE_API_URL)': process.env.REACT_APP_EVENTSOURCE_API_URL,
    },
    default: 'None',
  },
];
function setServiceLocations(data) {
  core.config({core: data.core});
  accounts.config({host: data.accounts});
  if (data.eventsource !== 'false') {
    eventSource.setHost(data.eventsource);
  }
}
setServiceLocations(getActiveEnvironments(fields)); /* step 1 above */


// Create a router to listen to the store and dispatch actions when the hash changes.
// Uses conduit, an open source router we made at Density: https://github.com/DensityCo/conduit
const initialRoute = '#/visualization/spaces';
const router = createRouter(store);
router.addRoute('login', () => routeTransitionLogin());

router.addRoute('visualization/spaces', () => routeTransitionVisualizationSpaceList());
router.addRoute('visualization/spaces/:id', id => routeTransitionVisualizationSpaceDetail(id));

router.addRoute('environment/spaces', () => routeTransitionEnvironmentSpace());

router.addRoute('dev/tokens', () => routeTransitionDevTokenList());
router.addRoute('dev/webhooks', () => routeTransitionDevWebhookList());

router.addRoute('account', () => routeTransitionAccount());

router.addRoute('account/register/:slug', slug => routeTransitionAccountRegister(slug));
router.addRoute('account/forgot-password/:token', token => routeTransitionAccountForgotPassword(token));

// Make sure that the user is logged in prior to going to a page.
function preRouteAuthentication() {
  // If at the root page and logged in, redirect to the initial route.
  if (store.getState().sessionToken !== null && ['', '#', '#/'].indexOf(window.location.hash) >= 0) {
    window.location.hash = initialRoute;

  // If on the account registration page (the only page that doesn't require the user to be logged in)
  // then don't worry about any of this.
  } else if (window.location.hash.startsWith("#/account/register")) {
    return;

  // If the user isn't logged in, send them to the login page.
  } else if (store.getState().sessionToken === null) {
    router.navigate('login');

  // Otherwise, fetch the logged in user's info since there's a session token available.
  } else {
    return accounts.users.me().then(data => data).catch(err => {
      // Login failed! Redirect the user to the login page and remove the bad session token from
      // the reducer.
      store.dispatch(userError(`User not logged in. Redirecting to login page. ${err}`));
      store.dispatch(sessionTokenUnSet());
      router.navigate('login');
    }).then(data => {
      store.dispatch(userSet(data));
    });
  }
}
preRouteAuthentication();

// Handle the route that the user is currently at.
router.handle();


// ----------------------------------------------------------------------------
// Real time event source
// Listen in real time for pushed events via websockets. When we receive
// events, dispatch them as actions into the system.
// ----------------------------------------------------------------------------
eventSource.setToken(store.getState().sessionToken);
eventSource.events.on('space', countChangeEvent => {
  store.dispatch(collectionSpacesCountChange({
    id: countChangeEvent.spaceId,
    timestamp: countChangeEvent.timestamp,
    countChange: countChangeEvent.countChange,
  }));
});
window.store = store;


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

registerServiceWorker();
