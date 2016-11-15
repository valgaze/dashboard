import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

function Sidebar(props) {
  const {} = props;
  
  return (
    <div className="content-sidebar">
      <ul className="sidebar-nav-list">
        <li className="list-header">
          <a href="#">Your Environment</a>
        </li>
        <li className="">
          <Link to='/tokens' className="">Tokens</Link>
        </li>
        <li>
          <Link to='/spaces' className="">Spaces</Link>
        </li>
        <li>
          <Link to='#' className="">Doorways</Link>
        </li>
        <li>
          <Link to='/events/1' className="">Events</Link>
        </li>
      </ul>
      <ul className="sidebar-nav-list">
        <li className="list-header">
          <a href="#">Account</a>
        </li>
        <li>
          <Link to='/account/change-password' className="">Change Password</Link>
        </li>
      </ul>
    </div>
  )
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);