import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

function Sidebar(props) {
  const {} = props;
  
  return (
    <div className="sidebar col-xs-0 col-md-4 off-md-0">
      <ul className="sidebar-nav-list">
        <li className="list-header">
          <span>API</span>
        </li>
        <li className="">
          <Link to='/' className="">Tokens</Link>
        </li>
        <li>
          <Link to='/spaces' className="">Spaces</Link>
        </li>
      </ul>
      <ul className="sidebar-nav-list">
        <li className="list-header">
          <span>Settings</span>
        </li>
        <li>
          <Link to='/account/change-password' className="">Account</Link>
        </li>
      </ul>
    </div>
  )
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);