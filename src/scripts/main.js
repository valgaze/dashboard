import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux';

import App from 'dashboard/app'
import Tokens from 'dashboard/components/tokens'
import store from 'dashboard/store';
import "whatwg-fetch"

import {Router, Route, browserHistory} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} />
      <Route path="/forgot-password" component={() => <span>Yo</span>} />
      <Route path="/tokens" component={Tokens} />
    </Router>
  </Provider>,
  document.getElementById('react-mount')
)
