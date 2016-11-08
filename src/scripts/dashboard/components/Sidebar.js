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
        <li className="active">
          <Link to='/tokens' className="">Tokens</Link>
        </li>
        <li>
          <Link to='/spaces' className="">Spaces</Link>
        </li>
        <li>
          <a href="#">Doorways</a>
        </li>
        <li>
          <Link to='#' className="">Events</Link>
        </li>
      </ul>
    </div>
  )
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);