import React from 'react';
import {connect} from 'react-redux';

import {
  loginFieldUpdate,
  loginSubmit
} from 'dashboard/actions/login';

function Login(props) {
  const {
    onLoginPressed,
    onUpdateLoginField,
    email,
    password,
    statusText
  } = props;

  return (
    <div className="container">
      <div className="login-section">
        <div className="row">
          <div className="col-xs-20 off-xs-2 col-md-8 off-md-8">
            <h1>Sign in</h1>
            {statusText}
            <input
              className="form-control"
              type="email"
              placeholder="Email Address"
              onChange={onUpdateLoginField('email')}
              defaultValue={email}
            />
            <input
              className="form-control"
              type="password"
              placeholder="Password"
              onChange={onUpdateLoginField('password')}
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
    </div>
  )
}

const mapStateToProps = state => ({
  email: state.login.email,
  password: state.login.password,
  statusText: state.login.statusText
});

const mapDispatchToProps = dispatch => ({
  onUpdateLoginField: field => event => {
    dispatch(loginFieldUpdate(field, event.target.value));
  },
  onLoginPressed: (email, password) => () => {
    dispatch(loginSubmit(email, password));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);