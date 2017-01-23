import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux';
import {Router, Route, hashHistory} from 'react-router';

import "whatwg-fetch"

import {GA_TRACKING_CODE, STRIPE_KEY} from 'dashboard/constants';
import jwt from 'jsonwebtoken';
import ReactGA from 'react-ga';
ReactGA.initialize(GA_TRACKING_CODE);
Stripe.setPublishableKey(STRIPE_KEY);

import store from 'dashboard/store';
import history from 'dashboard/route-requests'; 

import Alerts from 'dashboard/components/Alerts';
import Billing from 'dashboard/components/Billing';
import ChangePassword from 'dashboard/components/ChangePassword';
import ForgotPassword from 'dashboard/components/ForgotPassword';
import Login from 'dashboard/components/Login';
import SpaceDetail from 'dashboard/components/SpaceDetail';
import Spaces from 'dashboard/components/Spaces';
import Tokens from 'dashboard/components/Tokens';


function requireAuth(nextState, replace) {
  if (!window.localStorage.jwt) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function fireTracking() {
  var decoded = jwt.decode(window.localStorage.jwt);
  if (decoded) {
    ReactGA.set({ userId: decoded['auth']['orgs'][0]['id'] });
  }
  ReactGA.pageview(window.location.hash);
}

ReactDOM.render(
  <Provider store={store}>
    <Router onUpdate={fireTracking} history={history}>
      <Route path="tokens" component={Tokens} onEnter={requireAuth} />
      <Route path="login" component={Login} />
      <Route path="integrations/alerts" component={Alerts} />
      <Route path="forgot-password" component={ForgotPassword} />
      <Route path="spaces" component={Spaces} onEnter={requireAuth} />
      <Route path="spaces/:spaceId" component={SpaceDetail} onEnter={requireAuth} />
      <Route path="account/billing" component={Billing} />
      <Route path="account/change-password" component={ChangePassword} onEnter={requireAuth} />
    </Router>
  </Provider>,
  document.getElementById('react-mount')
)
