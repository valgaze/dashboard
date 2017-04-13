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
    loading
  } = props;

  return (
    <div className="container">
      <div className="login-section">
        <div className="row">
          <div className="col-xs-20 off-xs-2 col-md-8 off-md-8">
            <img className="app-icon" src="/assets/images/density_mark_black.png" alt="Density Logo" />
            <h1>Login</h1>
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
              className={loading ? "button button-primary login-button loading" : "button button-primary login-button"}
              onClick={onLoginPressed(email, password)}
              type="button"
              disabled={loading}>
              <span className="label">Log in</span>
              <img className={loading ? "loading-image" : "loading-image"} src="/assets/images/loading.gif" alt="Loading" />
            </button>
            {/*<Link to='/forgot-password' className="forgot-password-link">Forgot password?</Link>*/}
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  email: state.login.email,
  password: state.login.password,
  loading: state.login.loading
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