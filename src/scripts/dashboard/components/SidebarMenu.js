import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import {sidebarActions} from 'dashboard/ducks/sidebar';

function SidebarMenu(props) {
  const {
    onCloseSidebar,
    organizationId
  } = props;
  
  return (
    <div >
      <ul className="sidebar-nav-list">
        <li className="list-header">
          <span>API</span>
        </li>
        <li className="">
          <Link to='/tokens' className="" onClick={onCloseSidebar}>Tokens</Link>
        </li>
        <li>
          <Link to='/spaces' className="" onClick={onCloseSidebar}>Spaces</Link>
        </li>
      </ul>

      <ul className={["org_1RCEwpLcHhkZUVfSIwOyAa", "org_6wkQroQQA8HiMlPenCuyeI", "org_2SUEzcvWJKO4EipyEuwwo1"].indexOf(organizationId) > -1 ? "sidebar-nav-list" : "hide"}>
        <li className="list-header">
          <span>Integrations</span>
        </li>
        <li>
          <Link to='/integrations/alerts' className="" onClick={onCloseSidebar}>Alerts</Link>
        </li>
      </ul>

      <ul className="sidebar-nav-list">
        <li className="list-header">
          <span>Settings</span>
        </li>
        <li>
          <Link to='/account/change-password' className="" onClick={onCloseSidebar}>Account</Link>
          <Link to='/account/billing' className="" onClick={onCloseSidebar}>Billing</Link>
        </li>
      </ul>
    </div>
  )
}

const mapStateToProps = state => ({
  organizationId: state.organization.id
});

const mapDispatchToProps = dispatch => ({
  onCloseSidebar: () => {
    dispatch(sidebarActions.close());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarMenu);