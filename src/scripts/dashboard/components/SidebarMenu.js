import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import {sideNavClose} from 'dashboard/actions/appbar';

function SidebarMenu(props) {
  const {
    onCloseSideNav,
    organizationId
  } = props;
  
  return (
    <div >
      <ul className="sidebar-nav-list">
        <li className="list-header">
          <span>API</span>
        </li>
        <li className="">
          <Link to='/tokens' className="" onClick={onCloseSideNav}>Tokens</Link>
        </li>
        <li>
          <Link to='/spaces' className="" onClick={onCloseSideNav}>Spaces</Link>
        </li>
      </ul>

      <ul className={["1HfvtFz4fZ5dEMw96uD1we", "6wkQroQQA8HiMlPenCuyeI", "1RCEwpLcHhkZUVfSIwOyAa"].indexOf(organizationId) > -1 ? "sidebar-nav-list" : "hide"}>
        <li className="list-header">
          <span>Integrations</span>
        </li>
        <li>
          <Link to='/integrations/alerts' className="" onClick={onCloseSideNav}>Alerts</Link>
        </li>
      </ul>

      <ul className="sidebar-nav-list">
        <li className="list-header">
          <span>Settings</span>
        </li>
        <li>
          <Link to='/account/change-password' className="" onClick={onCloseSideNav}>Account</Link>
          <Link to='/account/billing' className="" onClick={onCloseSideNav}>Billing</Link>
        </li>
      </ul>
    </div>
  )
}

const mapStateToProps = state => ({
  organizationId: state.organization.id
});

const mapDispatchToProps = dispatch => ({
  onCloseSideNav: () => {
    dispatch(sideNavClose());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarMenu);