import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import {
  loginFieldUpdate,
  loginSubmit
} from 'dashboard/actions/login';

function Login(props) {
  const {
    onLoginPressed,
    onEnterPressed,
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
            <h1>Login</h1>
            {statusText}
            <input
              className="form-control"
              type="email"
              placeholder="Email Address"
              onChange={onUpdateLoginField('email')}
              onKeyPress={onEnterPressed(email, password)}
              defaultValue={email}
            />
            <input
              className="form-control"
              type="password"
              placeholder="Password"
              onChange={onUpdateLoginField('password')}
              onKeyPress={onEnterPressed(email, password)}
              defaultValue={password}
            />
            <button 
              className="button button-primary login-button"
              onClick={onLoginPressed(email, password)}
              type="button">
              Log in
            </button>
            <Link to='/forgot-password' className="forgot-password-link">Forgot password?</Link>
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
  },
  onEnterPressed: (email, password) => event => {
    if (event.key === 'Enter') {
      dispatch(loginSubmit(email, password));  
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);