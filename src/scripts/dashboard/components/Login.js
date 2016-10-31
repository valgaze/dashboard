import React from 'react';
import {connect} from 'react-redux';

import {
  loginUpdate,
  loginSubmit,
} from 'dashboard/actions/login';

function Login(props) {
  const {
    onLoginPressed,
    onUpdateLogin,
    email,
    password,
    statusText,
  } = props;

  return (
    <div className="login-section">
      <div className="row">
        <div className="col-xs-20 off-xs-2 col-md-8 off-md-8">
          <h1>Sign in</h1>
          {statusText}
          <input
            className="form-control"
            type="email"
            placeholder="Email Address"
            onChange={onUpdateLogin('email')}
            defaultValue={email}
          />
          <input
            className="form-control"
            type="password"
            placeholder="Password"
            onChange={onUpdateLogin('password')}
            defaultValue={password}
          />
          <button 
            className="button button-primary login-button"
            onClick={onLoginPressed(email, password)}
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

const mapStateToProps = state => ({
  email: state.login.email,
  password: state.login.password,
  statusText: state.login.statusText
});

const mapDispatchToProps = dispatch => ({
  onUpdateLogin: field => event => {
    dispatch(loginUpdate(field, event.target.value));
  },
  onLoginPressed: (email, password) => () => {
    dispatch(loginSubmit(email, password));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);