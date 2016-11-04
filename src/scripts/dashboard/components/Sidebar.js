import React from 'react';
import {connect} from 'react-redux';

function Sidebar(props) {
  const {} = props;
  
  return (
    <div className="content-sidebar">
      <ul className="sidebar-nav-list">
        <li className="list-header">
          <a href="#environment">Your Environment</a>
        </li>
        <li className="active">
          <a href="#environment-tokens" className="active">Tokens</a>
        </li>
        <li>
          <a href="#environment-spaces">Spaces</a>
        </li>
        <li>
          <a href="#environment-doorways">Doorways</a>
        </li>
        <li>
          <a href="#environment-events">Events</a>
        </li>
      </ul>
    </div>
  )
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);