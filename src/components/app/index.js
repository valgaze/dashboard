import * as React from 'react';
import Navbar from '@density/ui-navbar';

import sessionTokenUnset from '../../actions/session-token/unset';

import { connect } from 'react-redux';

import TokenList from '../token-list/index';
import SpaceList from '../space-list/index';
import SpaceDetail from '../space-detail/index';
import Login from '../login/index';
import Environment from '../environment/index';
import Account from '../account/index';
import WebhookList from '../webhook-list/index';
import AccountRegistration from '../account-registration/index';
import UnknownPage from '../unknown-page/index';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

function NavBarItem({activePage, pageName, href, children}) {
  return <li className={activePage === pageName ? 'active' : ''}>
    <a href={href}>{children}</a>
  </li>;
}

function AppComponent({activePage, onLogout}) {
  return <div className="app">
    {(activePage !== 'LOGIN' && activePage !== 'ACCOUNT_REGISTRATION') ? <Navbar>
      <NavBarItem activePage={activePage} pageName="ENVIRONMENT" href="#/environment">Environment</NavBarItem>
      <NavBarItem activePage={activePage} pageName="ACCOUNT" href="#/account">Account</NavBarItem>
      <NavBarItem activePage={activePage} pageName="TOKEN_LIST" href="#/tokens">Tokens</NavBarItem>
      <NavBarItem activePage={activePage} pageName="WEBHOOK_LIST" href="#/webhooks">Webhooks</NavBarItem>
      <NavBarItem activePage={activePage} pageName="SPACE_LIST" href="#/spaces">Spaces</NavBarItem>
      <button onClick={onLogout}>Logout</button>
    </Navbar> : null}

    {/* Insert the currently displayed page into the view */}
    <ActivePage activePage={activePage} />
  </div>;
}
const App = DragDropContext(HTML5Backend)(AppComponent);

function ActivePage({activePage}) {
  switch (activePage) {
  case "LOGIN":
    return <Login />;
  case "TOKEN_LIST":
    return <TokenList />;
  case "SPACE_LIST":
    return <SpaceList />;
  case "SPACE_DETAIL":
    return <SpaceDetail />;
  case "ENVIRONMENT":
    return <Environment />;
  case "ACCOUNT":
    return <Account />;
  case "WEBHOOK_LIST":
    return <WebhookList />;
  case "ACCOUNT_REGISTRATION":
    return <AccountRegistration />;
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
