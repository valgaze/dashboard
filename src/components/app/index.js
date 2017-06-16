import * as React from 'react';
import Navbar from '@density/ui-navbar';

import sessionTokenUnset from '../../actions/session-token/unset';

import { connect } from 'react-redux';

import TokenList from '../token-list/index';
import Login from '../login/index';
import UnknownPage from '../unknown-page/index';

export function App({activePage, onLogout}) {
  return <div className="app">
    {activePage !== 'LOGIN' ? <Navbar subtitle="Dashboard" /> : null}

    <button onClick={onLogout}>Logout</button>

    {/* Insert the currently displayed page into the view */}
    <ActivePage activePage={activePage} />
  </div>;
}

function ActivePage({activePage}) {
  switch (activePage) {
  case "LOGIN":
    return <Login />;
  case "TOKEN_LIST":
    return <TokenList />;
  case "SPACE_LIST":
    return <div />;
  case "SPACE_DETAIL":
    return <div />;
  default:
    return <UnknownPage invalidUrl={activePage} />;
  }
}


export default connect(state => {
  return {
    activePage: state.activePage,
  };
}, dispatch => {
  return {
    onLogout() {
      dispatch(sessionTokenUnset());
      window.location.hash = '#/login';
    },
  }
})(App);
