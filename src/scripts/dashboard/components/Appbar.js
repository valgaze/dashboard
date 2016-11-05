import React from 'react';
import {connect} from 'react-redux';

function Appbar(props) {
  const {} = props;
  
  return (
    <div className="app-bar">
      <a className="app-bar-brand" href="/">
        <img className="app-bar-logo" src="/assets/images/app_bar_logo.png" alt="Density Logo" />
      </a>
      <div className="app-bar-nav app-bar-nav-right">
        <a className="button button-inverse" href="https://www.density.io/pricing/">Sign Out</a>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);