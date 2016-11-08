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

const history = syncHistoryWithStore(hashHistory, store);

function requireAuth(nextState, replace) {
  if (!window.localStorage.jwt) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Tokens} onEnter={requireAuth} />
      <Route path="login" component={Login} />
      <Route path="forgot-password" component={ForgotPassword} />
      <Route path="tokens" component={Tokens} onEnter={requireAuth} />
      <Route path="spaces" component={Spaces} onEnter={requireAuth} />
      <Route path="events/:page" component={Events} onEnter={requireAuth} />
    </Router>
  </Provider>,
  document.getElementById('react-mount')
)
