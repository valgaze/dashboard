import * as React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { accounts } from '@density-int/client';
import sessionTokenSet from '../../actions/session-token/set';

import { InputStackItem, InputStackGroup } from '@density/ui-input-stack';
import Button from '@density/ui-button';
import Toast from '@density/ui-toast';
import Navbar from '@density/ui-navbar';

import Mark from '@density/ui-density-mark';

export const LOGIN = 'LOGIN',
             FORGOT_PASSWORD = 'FORGOT_PASSWORD';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: LOGIN,
      email: '',
      password: '',
      loading: false,
      error: null,
    };
  }

  isLoginFormValid() {
    return this.state.view === LOGIN &&
      this.state.email.indexOf('@') >= 0 &&
      this.state.password.length > 0 &&
      !this.state.loading;
  }

  isForgotPasswordFormValid() {
    return this.state.view === FORGOT_PASSWORD &&
      this.state.email.indexOf('@') >= 0 &&
      !this.state.loading;
  }

  onEnter(e) {
    if (e.key === 'Enter') {
      if (this.isLoginFormValid.apply(this)) {
        this.onLogin();
      } else if (this.isForgotPasswordFormValid.apply(this)) {
        this.onForgotPassword();
      }
    }
  }

  onLogin() {
    this.setState({loading: true, error: null});
    return accounts.users.login({
      email: this.state.email,
      password: this.state.password,
    }).then(token => {
      this.setState({loading: false, error: null});
      this.props.onUserSuccessfullyLoggedIn(token);
    }).catch(error => {
      this.setState({loading: false, error: error.toString()});
    });
  }

  onForgotPassword() {
    this.setState({loading: true, error: null});
    return accounts.users.password_forgot({
      email: this.state.email,
    }).then(resp => {
      this.setState({loading: false, error: null, forgotPasswordConfirmation: resp.message});
    }).catch(error => {
      this.setState({loading: false, error});
    });
  }

  renderLoginForm() {
    return <div className="login-form-container">
      {/* Input stack used to enter login info */}
      <InputStackGroup className="login-form">
        <InputStackItem
          type="email"
          placeholder="Email Address"
          invalid={this.state.email.length > 0 && this.state.email.indexOf('@') === -1}
          onChange={e => this.setState({email: e.target.value})}
          onKeyPress={this.onEnter.bind(this)}
          value={this.state.email}
        />
        <InputStackItem
          type="password"
          placeholder="Password"
          onChange={e => this.setState({password: e.target.value})}
          onKeyPress={this.onEnter.bind(this)}
          value={this.state.password}
        />
      </InputStackGroup>

      {/* Submit the form! */}
      <Button 
        className={classnames('login-submit-button', {loading: this.state.loading})}
        size="large"
        onClick={this.onLogin.bind(this)}
        disabled={!this.isLoginFormValid.apply(this)}
      >Login</Button>

      {/* Move to forgot password view */}
      <div
        className="login-forgot-password-link"
        onClick={() => this.setState({view: FORGOT_PASSWORD, error: null})}
      >Forgot Password</div>
    </div>;
  }

  renderForgotPasswordForm() {
    return <div className="login-form-container">
      {this.state.forgotPasswordConfirmation ? <Toast
        className="login-toast"
        type="success"
        icon={<span className="login-toast-icon">&#xe908;</span>}
      >
        <p>{this.state.forgotPasswordConfirmation}</p>
      </Toast> : null}

      <h2 className="login-password-reset-title">Send password change request</h2>
      <InputStackGroup className="login-password-reset-form">
        <InputStackItem
          type="email"
          placeholder="Email Address"
          invalid={this.state.email.length > 0 && this.state.email.indexOf('@') === -1}
          onChange={e => this.setState({email: e.target.value, error: null})}
          onKeyPress={this.onEnter.bind(this)}
          value={this.state.email}
        />
      </InputStackGroup>

      {/* Submit the form! */}
      <Button 
        className={classnames('login-submit-button', {loading: this.state.loading})}
        onClick={this.onForgotPassword.bind(this)}
        size="large"
        disabled={!this.isForgotPasswordFormValid.apply(this)}
      >Send Request</Button>

      {/* Move to back to login page */}
      <div
        className="login-forgot-password-back-link"
        onClick={() => this.setState({view: LOGIN, error: null})}
      >Back to login</div>
    </div>;
  }

  render() {
    return <div className="login">
      <Navbar />
      { this.state.loading ? <div className="login-navbar-loading" /> : null }

      {/* Render any errors with previous login attempts */}
      {this.state.error ? <Toast className="login-toast" type="danger" icon={<span className="login-toast-icon">&#xe928;</span>}>
        <h3 className="login-toast-header">Incorrect password</h3>
        <p>{this.state.error}</p>
      </Toast> : null}

      <div className="login-section">
        <Mark className="login-density-logo" />

        {/* Login inputs */}
        {this.state.view === LOGIN ?
          this.renderLoginForm.apply(this) :
          this.renderForgotPasswordForm.apply(this)}
      </div>
    </div>;
  }
}


export default connect(state => ({}), dispatch => {
  return {
    onUserSuccessfullyLoggedIn(token) {
      dispatch(sessionTokenSet(token));
      window.location.hash = '#/visualization/spaces';
    },
  };
})(Login);
