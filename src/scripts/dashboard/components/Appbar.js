import React from 'react';
import {connect} from 'react-redux';

import {logoutUser} from 'dashboard/actions/logout'

function Appbar(props) {
  const {
    logOutClicked
  } = props;
  
  return (
    <div className="app-bar">
      <a className="app-bar-brand" href="/">
        <img className="app-bar-logo" src="/assets/images/app_bar_logo.png" alt="Density Logo" />
      </a>
      <div className="app-bar-nav app-bar-nav-right">
        <button className="button button-inverse" onClick={logOutClicked}>Log Out</button>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  logOutClicked: () => {
    dispatch(logoutUser());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);