import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux';
import {Router, Route, hashHistory} from 'react-router';

import "whatwg-fetch"

import {GA_TRACKING_CODE, STRIPE_KEY} from 'dashboard/constants';
import ReactGA from 'react-ga';
ReactGA.initialize(GA_TRACKING_CODE);
Stripe.setPublishableKey(STRIPE_KEY);

import store from 'dashboard/store';
import history from 'dashboard/route-requests'; 

import Alerts from 'dashboard/screens/Alerts';
import Billing from 'dashboard/screens/Billing';
import ChangePassword from 'dashboard/screens/ChangePassword';
import ForgotPassword from 'dashboard/screens/ForgotPassword';
import Login from 'dashboard/screens/Login';
import SpaceDetail from 'dashboard/screens/SpaceDetail';
import Spaces from 'dashboard/screens/Spaces';
import Tokens from 'dashboard/screens/Tokens';


function requireAuth(nextState, replace) {
  if (!window.localStorage.token) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function fireTracking() {
  ReactGA.set({ userId: window.localStorage.orgId });
  ReactGA.pageview(window.location.hash);
}

ReactDOM.render(
  <Provider store={store}>
    <Router onUpdate={fireTracking} history={history}>
      <Route path="tokens" component={Tokens} onEnter={requireAuth} />
      <Route path="login" component={Login} />
      <Route path="integrations/alerts" component={Alerts} onEnter={requireAuth} />
      <Route path="forgot-password" component={ForgotPassword} />
      <Route path="spaces" component={Spaces} onEnter={requireAuth} />
      <Route path="spaces/:spaceId" component={SpaceDetail} onEnter={requireAuth} />
      <Route path="account/billing" component={Billing} onEnter={requireAuth} />
      <Route path="account/change-password" component={ChangePassword} onEnter={requireAuth} />
    </Router>
  </Provider>,
  document.getElementById('react-mount')
)
