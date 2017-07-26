import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './built-css/styles.css';
import { core, accounts } from '@density-int/client';

import userSet from './actions/user/set';
import userError from './actions/user/error';

import eventSource from './helpers/websocket-event-pusher/index';

// The main app component that renders everything.
import App from './components/app';

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
import store from './store';

// Set the location of all services.
core.config({core: 'https://api.density.io/v2'});
accounts.config({host: 'https://clerk.density.io/v1'});
// eventSource.setHost('ws://localhost:8080');

// Create a router to listen to the store and dispatch actions when the hash changes.
// Uses conduit, an open source router we made at Density: https://github.com/DensityCo/conduit
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
  // If on the account registration page (the only page that doesn't require the user to be logged in)
  // then don't worry about any of this.
  if (window.location.hash.startsWith("#/account/register")) {
    return;

  // If the user isn't logged in, send them to the login page.
  } else if (store.getState().sessionToken === null) {
    router.navigate('login');

  // Otherwise, fetch the logged in user's info since there's a session token available.
  } else {
    accounts.users.me().then(data => data).catch(err => {
      store.dispatch(userError(err));
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
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
