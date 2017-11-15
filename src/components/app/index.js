import * as React from 'react';
import Navbar, { NavbarItem } from '@density/ui-navbar';
import NavbarSidebar, { NavbarSidebarItem } from '@density/ui-navbar-sidebar';

import sessionTokenUnset from '../../actions/session-token/unset';

import { connect } from 'react-redux';

import featureFlagEnabled from '../../helpers/feature-flag-enabled/index';

import TokenList from '../dev-token-list/index';
import SpaceList from '../visualization-space-list/index';
import SpaceDetail from '../visualization-space-detail/index';
import Login from '../login/index';
import Environment from '../environment/index';
import Account from '../account/index';
import WebhookList from '../dev-webhook-list/index';
import AccountRegistration from '../account-registration/index';
import AccountForgotPassword from '../account-forgot-password/index';

import AccountSetupOverview from '../account-setup-overview/index';
import AccountSetupDoorwayList from '../account-setup-doorway-list/index';
import AccountSetupDoorwayDetail from '../account-setup-doorway-detail/index';

import UnknownPage from '../unknown-page/index';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import MultiBackend, { TouchTransition, Preview } from 'react-dnd-multi-backend';


class NavbarWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  closeSidebar() {
    this.setState({ show: false })
  }

  render() {
    const {features} = this.props;
    return <Navbar onClickSidebarButton={() => this.setState({show: !this.state.show})}>
      <NavbarItem
        activePage={this.props.activePage}
        pageName={[
          'ACCOUNT_SETUP_OVERVIEW',
          'ACCOUNT_SETUP_DOORWAY_LIST',
          'ACCOUNT_SETUP_DOORWAY_DETAIL',
        ]}
        href="#/account/setup/overview"
      >Onboarding</NavbarItem>

      <NavbarItem
        activePage={this.props.activePage}
        pageName={['VISUALIZATION_SPACE_LIST', 'VISUALIZATION_SPACE_DETAIL']}

        // Feature flag: Do not allow the user to visit the visualizations page until it has been
        // unlocked. During the onboarding process, the organization will not have spaces / doorways
        // so this page does not make sense.
        locked={featureFlagEnabled(features.visualizationPageLocked)}
        href="#/visualization/spaces"
      >Visualization</NavbarItem>

      {/* Feature flag: Don't show the environment page by default, but when a flag is enabled show it. */}
      {featureFlagEnabled(features.environmentPageVisible) ? <NavbarItem
        activePage={this.props.activePage}
        pageName={['ENVIRONMENT_SPACE']}
        href="#/environment/spaces"
      >Environment</NavbarItem> : null}

      <NavbarItem
        activePage={this.props.activePage}
        pageName={['DEV_TOKEN_LIST', 'DEV_WEBHOOK_LIST']}
        href="#/dev/tokens"
      >Developer Tools</NavbarItem>
      <NavbarItem
        activePage={this.props.activePage}
        pageName={['ACCOUNT']}
        href="#/account"
      >Account</NavbarItem>
      <span aria-label="Logout" title="Logout" className="navbar-item-logout">
        <a onClick={this.props.onLogout}>&#xe923;</a>
      </span>

      <NavbarSidebar show={this.state.show}>
        <NavbarSidebarItem
          header={true}
          activePage={this.props.activePage}
          pageName={['VISUALIZATION_SPACE_LIST', 'VISUALIZATION_SPACE_DETAIL']}
          href="#/visualization/spaces"
          onClick={this.closeSidebar.bind(this)}
        >Visualization</NavbarSidebarItem>

        {/* Feature flag: Don't show the environment page by default, but when a flag is enabled show it. */}
        {featureFlagEnabled(features.environmentPageVisible) ? <NavbarSidebarItem
          header={true}
          activePage={this.props.activePage}
          pageName={['ENVIRONMENT_SPACE', 'ENVIRONMENT_SENSOR']}
          href="#/environment/spaces"
          onClick={this.closeSidebar.bind(this)}
        >Environment</NavbarSidebarItem> : null}
        {featureFlagEnabled(features.environmentPageVisible) ? <NavbarSidebarItem
          activePage={this.props.activePage}
          pageName="ENVIRONMENT_SPACE"
          href="#/environment/spaces"
          onClick={this.closeSidebar.bind(this)}
        >Spaces</NavbarSidebarItem> : null}
        {/* <NavbarSidebarItem activePage={this.props.activePage} pageName='ENVIRONMENT_SENSOR' href="#/environment/sensors">Sensors</NavbarSidebarItem> */}

        <NavbarSidebarItem
          header={true}
          activePage={this.props.activePage}
          pageName={['DEV_TOKEN_LIST', 'DEV_WEBHOOK_LIST']}
          href="#/dev/tokens"
          onClick={this.closeSidebar.bind(this)}
        >Developer Tools</NavbarSidebarItem>
        <NavbarSidebarItem activePage={this.props.activePage} pageName={['DEV_TOKEN_LIST']} href="#/dev/tokens" onClick={this.closeSidebar.bind(this)}>Tokens</NavbarSidebarItem>
        <NavbarSidebarItem activePage={this.props.activePage} pageName={['DEV_WEBHOOK_LIST']} href="#/dev/webhooks" onClick={this.closeSidebar.bind(this)}>Webhooks</NavbarSidebarItem>
        <NavbarSidebarItem activePage={false} pageName={[]} href="http://docs.density.io">
          API Documentation
          <span className="app-api-docs-icon">&#xe91b;</span>
        </NavbarSidebarItem>

        <NavbarSidebarItem
          header={true}
          activePage={this.props.activePage}
          pageName={['ACCOUNT']}
          href={['#/account']}
          onClick={this.closeSidebar.bind(this)}
        >Account</NavbarSidebarItem>
      </NavbarSidebar>
    </Navbar>;
  }
}

function AppComponent({activePage, features, onLogout}) {
  return <div className="app">
    {/* Render the navbar */}
    {(
      activePage !== 'LOGIN' &&
      activePage !== 'ACCOUNT_REGISTRATION' &&
      activePage !== 'ACCOUNT_FORGOT_PASSWORD'
    ) ? <NavbarWrapper
      activePage={activePage}
      features={features}
      onLogout={onLogout}
    /> : null}

    {/* Render dragging preview when an item is being dragged */}
    <Preview generator={(type, item, style) => <div style={style} />} />

    {/* Insert the currently displayed page into the view */}
    <ActivePage activePage={activePage} />
  </div>;
}
const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend,
    },
    {
      backend: TouchBackend({enableMouseEvents: true}),
      preview: true,
      transition: TouchTransition,
    },
  ],
};
const App = DragDropContext(MultiBackend(HTML5toTouch))(AppComponent);

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
  case "ACCOUNT_FORGOT_PASSWORD":
    return <AccountForgotPassword />;
  case "ACCOUNT_SETUP_OVERVIEW":
    return <AccountSetupOverview />;
  case "ACCOUNT_SETUP_DOORWAY_LIST":
    return <AccountSetupDoorwayList />;
  case "ACCOUNT_SETUP_DOORWAY_DETAIL":
    return <AccountSetupDoorwayDetail />;
  default:
    return <UnknownPage invalidUrl={activePage} />;
  }
}


export default connect(state => {
  return {
    activePage: state.activePage,
    features: (state.user && state.user.user && state.user.user.features) || {},
  };
}, dispatch => {
  return {
    onLogout() {
      dispatch(sessionTokenUnset());
      window.location.hash = '#/login';
    },
  }
})(App);
