import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './built-css/styles.css';
import { core, accounts } from '@density-int/client';

import userSet from './actions/user/set';
import userError from './actions/user/error';

// The main app component that renders everything.
import App from './components/app';

// Redux is used to manage state.
import {createStore, compose, applyMiddleware, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import createRouter from '@density/conduit';

// Import all actions required to navigate from one page to another.
import routeTransitionEnvironment from './actions/route-transition/environment';
import routeTransitionLogin from './actions/route-transition/login';
import routeTransitionSpaceDetail from './actions/route-transition/space-detail';
import routeTransitionSpaceList from './actions/route-transition/space-list';
import routeTransitionTokenList from './actions/route-transition/token-list';
import routeTransitionWebhookList from './actions/route-transition/webhook-list';
import routeTransitionAccount from './actions/route-transition/account';

// Assemble all parts of the reducer
import activeModal from './reducers/active-modal/index';
import activePage from './reducers/active-page/index';
import doorways from './reducers/doorways/index';
import links from './reducers/links/index';
import sessionToken from './reducers/session-token/index';
import spaces from './reducers/spaces/index';
import tokens from './reducers/tokens/index';
import user from './reducers/user/index';
import webhooks from './reducers/webhooks/index';
const reducer = combineReducers({
  activeModal,
  activePage,
  doorways,
  links,
  sessionToken,
  spaces,
  tokens,
  user,
  webhooks,
});

core.config({core: 'https://api.density.io/v2'});
accounts.config({core: 'https://accounts.density.io/v1'});

// Create our redux store for storing the application state.
const store = createStore(reducer, {}, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

// Create a router to listen to the store and dispatch actions when the hash changes.
// Uses conduit, an open source router we made at Density: https://github.com/DensityCo/conduit
const router = createRouter(store);
router.addRoute('login', () => routeTransitionLogin());
router.addRoute('spaces', () => routeTransitionSpaceList());
router.addRoute('spaces/:id', ({id}) => routeTransitionSpaceDetail(id));

router.addRoute('environment', () => routeTransitionEnvironment());
router.addRoute('account', () => routeTransitionAccount());
router.addRoute('tokens', () => routeTransitionTokenList());
router.addRoute('webhooks', () => routeTransitionWebhookList());

// If the user isn't logged in, send them to the login page.
if (store.getState().sessionToken === null) {
  router.navigate('login');
} else {
  // Fetch the logged in user's info since there's a session token available.
  accounts.users.me().then(data => data).catch(err => {
    store.dispatch(userError(err));
  }).then(data => {
    store.dispatch(userSet(data));
  });
}

// Handle the route that the user is currently at.
router.handle();


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
