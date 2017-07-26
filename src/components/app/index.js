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
  return <li className={pageName.indexOf(activePage) >= 0 ? 'active' : ''}>
    <a href={href}>{children}</a>
  </li>;
}

function AppComponent({activePage, onLogout}) {
  return <div className="app">
    {(activePage !== 'LOGIN' && activePage !== 'ACCOUNT_REGISTRATION') ? <Navbar>
      <NavBarItem activePage={activePage} pageName={['VISUALIZATION_SPACE_LIST']} href="#/visualization/spaces">Visualization</NavBarItem>
      <NavBarItem activePage={activePage} pageName={['ENVIRONMENT_SPACE']} href="#/environment/spaces">Environment</NavBarItem>
      <NavBarItem
        activePage={activePage}
        pageName={['DEV_TOKEN_LIST', 'DEV_WEBHOOK_LIST']}
        href="#/dev/tokens"
      >Developer Tools</NavBarItem>
      <NavBarItem activePage={activePage} pageName={['ACCOUNT']} href="#/account">Account</NavBarItem>
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
  case "VISUALIZATION_SPACE_LIST":
    return <SpaceList />;
  case "VISUALIZATION_SPACE_DETAIL":
    return <SpaceDetail />;
  case "ENVIRONMENT_SPACE":
    return <Environment />;
  case "ACCOUNT":
    return <Account />;
  case "DEV_WEBHOOK_LIST":
    return <WebhookList />;
  case "DEV_TOKEN_LIST":
    return <TokenList />;
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
