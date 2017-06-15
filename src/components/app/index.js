import * as React from 'react';
import Navbar from '@density/ui-navbar';

import { connect } from 'react-redux';

import TokenList from '../token-list/index';
import UnknownPage from '../unknown-page/index';

export function App({activePage}) {
  return <div className="app">
    <Navbar subtitle="Dashboard" />

    {/* Insert the currently displayed page into the view */}
    <ActivePage activePage={activePage} />
  </div>;
}

function ActivePage({activePage}) {
  switch (activePage) {
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
  return {}
})(App);
