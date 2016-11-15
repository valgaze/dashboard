import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

function Sidebar(props) {
  const {} = props;
  
  return (
    <div className="content-sidebar">
      <ul className="sidebar-nav-list">
        <li className="list-header">
          <span>Your Environment</span>
        </li>
        <li className="">
          <Link to='/tokens' className="">Tokens</Link>
        </li>
        <li>
          <Link to='/spaces' className="">Spaces</Link>
        </li>
        <li>
          <Link to='/events/1' className="">Events</Link>
        </li>
        {/*
        <li>
          <Link to='#' className="">Doorways</Link>
        </li>
        
        */}
      </ul>
      {/*
      <ul className="sidebar-nav-list">
        <li className="list-header">
          <span>Settings</span>
        </li>
        <li>
          <Link to='/account/change-password' className="">Account</Link>
        </li>
      </ul>
      */}
    </div>
  )
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);