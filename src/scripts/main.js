import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux';
import {Router, Route, hashHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux'

import "whatwg-fetch"

import ga from 'dashboard/helpers/google-analytics/index';
import fetchParam from 'dashboard/helpers/fetch-param';

import App from 'dashboard/app';
import store from 'dashboard/store';
import Login from 'dashboard/components/Login';
import ForgotPassword from 'dashboard/components/ForgotPassword';
import Tokens from 'dashboard/components/Tokens';
import Spaces from 'dashboard/components/Spaces';
import SpaceDetail from 'dashboard/components/SpaceDetail';
import ChangePassword from 'dashboard/components/ChangePassword';

import {spacesIndex, spacesRead} from 'dashboard/actions/spaces';
import {eventsIndex} from 'dashboard/actions/events';
import {doorwaysIndex} from 'dashboard/actions/doorways';
import {tokensIndex} from 'dashboard/actions/tokens';

const history = syncHistoryWithStore(hashHistory, store);

function requireAuth(nextState, replace) {
  if (!window.localStorage.jwt) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

var spacesReadInterval;
var spacesIndexInterval;

history.listen(location => {
  clearInterval(spacesIndexInterval);
  clearInterval(spacesReadInterval);
  if (location.pathname === "/") {
    store.dispatch(spacesIndex());
    store.dispatch(doorwaysIndex());
    store.dispatch(tokensIndex());
    store.dispatch(eventsIndex(1, 10));
  } else if (location.pathname.startsWith("/spaces/") && location.pathname.length > 8) {
    var spaceId = fetchParam(location);
    store.dispatch(spacesRead(spaceId));
    store.dispatch(eventsIndex(1, 10));
    spacesReadInterval = setInterval(() => {
      store.dispatch(spacesRead(spaceId));
    }, 2000);
  } else if (location.pathname === "/spaces") {
    store.dispatch(spacesIndex());
    spacesIndexInterval = setInterval(() => {
      store.dispatch(spacesIndex());
    }, 2000);
  }
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Tokens} onEnter={requireAuth} />
      <Route path="login" component={Login} />
      <Route path="forgot-password" component={ForgotPassword} />
      <Route path="spaces" component={Spaces} onEnter={requireAuth} />
      <Route path="spaces/:spaceId" component={SpaceDetail} onEnter={requireAuth} />
      <Route path="account/change-password" component={ChangePassword} onEnter={requireAuth} />
    </Router>
  </Provider>,
  document.getElementById('react-mount')
)
