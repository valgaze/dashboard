import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux';
import {Router, Route, hashHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux'

import "whatwg-fetch"

import App from 'dashboard/app';
import store from 'dashboard/store';
import Login from 'dashboard/components/Login';
import ForgotPassword from 'dashboard/components/ForgotPassword';
import Tokens from 'dashboard/components/Tokens';
import Spaces from 'dashboard/components/Spaces';
import Events from 'dashboard/components/Events';
import ChangePassword from 'dashboard/components/ChangePassword';

import {spacesGet} from 'dashboard/actions/spaces';
import {eventsGet} from 'dashboard/actions/events';
import {doorwaysGet} from 'dashboard/actions/doorways';
import {tokensGet} from 'dashboard/actions/tokens';

const history = syncHistoryWithStore(hashHistory, store);

function requireAuth(nextState, replace) {
  if (!window.localStorage.jwt) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

history.listen(location => {
  console.log(location);

  if (location.pathname === "/") {
    store.dispatch(spacesGet());
    store.dispatch(doorwaysGet());
    store.dispatch(tokensGet());
    store.dispatch(eventsGet(1, 10));
  } else if (location.pathname === "/spaces") {
    store.dispatch(spacesGet());
  } else if (location.pathname.startsWith("/events")) {
    store.dispatch(spacesGet());
    store.dispatch(doorwaysGet());
    store.dispatch(eventsGet(1, 10));
  }
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Tokens} onEnter={requireAuth} />
      <Route path="login" component={Login} />
      <Route path="forgot-password" component={ForgotPassword} />
      <Route path="tokens" component={Tokens} onEnter={requireAuth} />
      <Route path="spaces" component={Spaces} onEnter={requireAuth} />
      <Route path="events/:page" component={Events} onEnter={requireAuth} />
      <Route path="account/change-password" component={ChangePassword} onEnter={requireAuth} />
    </Router>
  </Provider>,
  document.getElementById('react-mount')
)
