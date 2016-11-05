import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux';

import App from 'dashboard/app'
import store from 'dashboard/store';
import Tokens from 'dashboard/components/Tokens'
import Login from 'dashboard/components/Login'
import "whatwg-fetch"

import {Router, Route, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux'

const history = syncHistoryWithStore(browserHistory, store);

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
      <Route path="forgot-password" component={() => <span>Yo</span>} />
    </Router>
  </Provider>,
  document.getElementById('react-mount')
)
