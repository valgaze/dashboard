import React from 'react';
import {connect} from 'react-redux';

import {
  loginButtonPress,
} from 'dashboard/actions/login';

function Login(props) {
  const {
      loginPressed,
  } = props;

  return (
    <div className="login-section">
      <div className="row">
        <div className="col-xs-20 off-xs-2 col-md-8 off-md-8">
          <h1>Sign in</h1>
          <input
            className="form-control"
            type="email"
            placeholder="Email Address"
          />
          <input
            className="form-control"
            type="password"
            placeholder="Password"
          />
          <button 
            className="button button-primary login-button"
            onClick={loginPressed}
            type="button">
            Login
          </button>
          <a
            href="/forgot-password" 
            className="forgot-password-link">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  loginPressed: () => {
    dispatch(loginButtonPress())
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);