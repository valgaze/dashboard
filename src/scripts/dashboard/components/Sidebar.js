import React from 'react';
import {connect} from 'react-redux';

function Sidebar(props) {
  const {} = props;
  
  return (
    <div className="content-sidebar">
      <ul className="sidebar-nav-list">
        <li className="list-header">
          <a href="#">Your Environment</a>
        </li>
        <li className="active">
          <a href="#" className="active">Tokens</a>
        </li>
        <li>
          <a href="#">Spaces</a>
        </li>
        <li>
          <a href="#">Doorways</a>
        </li>
        <li>
          <a href="#">Events</a>
        </li>
      </ul>
    </div>
  )
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);