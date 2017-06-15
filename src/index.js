import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './built-css/styles.css';

// The main app component that renders everything.
import App from './components/app';

// Redux is used to manage state.
import {createStore, compose, applyMiddleware, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import createRouter from '@density/conduit';

// Import all actions required to navigate from one page to another.
import routeTransitionTokenList from './actions/route-transition/token-list';
import routeTransitionSpaceDetail from './actions/route-transition/space-detail';
import routeTransitionSpaceList from './actions/route-transition/space-list';

// Assemble all parts of the reducer
import activePage from './reducers/activePage';
import spaces from './reducers/spaces';
import tokens from './reducers/tokens';
const reducer = combineReducers({
  activePage,
  spaces,
  tokens,
});

// Create our redux store for storing the application state.
const store = createStore(reducer, {}, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

// Create a router to listen to the store and dispatch actions when the hash changes.
// Uses conduit, an open source router we made at Density: https://github.com/DensityCo/conduit
const router = createRouter(store);
router.addRoute("tokens", () => routeTransitionTokenList());
router.addRoute("spaces", () => routeTransitionSpaceList());
router.addRoute("spaces/:id", ({id}) => routeTransitionSpaceDetail(id));

// Handle the route that the user is currently at.
router.handle();


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
