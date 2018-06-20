import * as React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { accounts } from '../../client';
import sessionTokenSet from '../../actions/session-token/set';
import unsafeNavigateToLandingPage from '../../helpers/unsafe-navigate-to-landing-page/index';

import { InputStackItem, InputStackGroup } from '../input-stack/index';
import Button from '@density/ui-button';
import Toast from '@density/ui-toast';

import Mark from '@density/ui-density-mark';
import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';

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

      // If we were just at the forgot password page, then show a popup to the user telling them
      // that their password reset was successful.
      referredFromForgotPassword: window.localStorage && window.localStorage.referredFromForgotPassword === 'true',
    };

    // Also, unset that forgot password referer flag now that it has been noted into the state of
    // the login page component (on future page loads, the forgot password page is no longer the
    // referrer)
    if (window.localStorage && window.localStorage.referredFromForgotPassword) {
      delete window.localStorage.referredFromForgotPassword;
    }
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

      { this.state.loading ? <div className="login-navbar-loading" /> : null }

      <div className="login-section">
        {/* Render a toast if the password reset process was successful */}
        {this.state.referredFromForgotPassword ? <Toast
          className="login-toast login-toast-forgot-password"
          type="success"
          icon={<span className="login-toast-icon">&#xe908;</span>}
        >
          <p>Password reset successful, log in using your new credentials.</p>
        </Toast> : null}

        {this.props.user && this.props.user.error ? <Toast
          className="login-toast login-toast-forgot-password"
          type="danger"
          icon={<span className="login-toast-icon">&#xe928;</span>}
        >
          {this.props.user.error}
        </Toast> : null}

        {/* Render any errors with previous login attempts */}
        {this.state.error ? <Toast className="login-toast" type="danger" icon={<span className="login-toast-icon">&#xe928;</span>}>
          <h3 className="login-toast-header">Incorrect password</h3>
          <p>{this.state.error}</p>
        </Toast> : null}

        <Mark className="login-density-logo" />

        {/* Login inputs */}
        {this.state.view === LOGIN ?
          this.renderLoginForm.apply(this) :
          this.renderForgotPasswordForm.apply(this)}
      </div>
    </div>;
  }
}


export default connect(state => ({
  user: state.user,
}), dispatch => {
  return {
    onUserSuccessfullyLoggedIn(token) {
      dispatch(sessionTokenSet(token)).then(data => {
        const user = objectSnakeToCamel(data);
        unsafeNavigateToLandingPage(user.organization.settings.insightsPageLocked);
      });
    },
  };
})(Login);
