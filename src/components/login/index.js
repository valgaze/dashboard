import * as React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { accounts } from '@density-int/client';
import sessionTokenSet from '../../actions/session-token/set';

import { InputStackItem, InputStackGroup } from '@density/ui-input-stack';

const LOGIN = 'LOGIN', FORGOT_PASSWORD = 'FORGOT_PASSWORD';

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

  onEnter(e) {
    if (e.key === 'Enter') {
      this.onLogin();
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
      this.setState({loading: false, error: error.message});
    });
  }

  onForgotPassword() {
    this.setState({loading: true, error: null});
    return accounts.users.password_forgot({
      email: this.state.email,
    }).then(resp => {
      this.setState({loading: false, error: null, forgotPasswordConfirmation: resp.message});
    }).catch(error => {
      this.setState({loading: false, error: error.message});
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

      {/* Move to forgot password view */}
      <div
        className="login-forgot-password-link"
        onClick={() => this.setState({view: FORGOT_PASSWORD, error: null})}
      >Forgot Password</div>

      {/* Submit the form! */}
      <button 
        className={classnames('login-submit-button', {loading: this.state.loading})}
        onClick={this.onLogin.bind(this)}
        type="button"
        disabled={this.state.loading || this.state.email.indexOf('@') === -1}
      >
        <span className="label">Login</span>
        {this.state.loading ? <img
          className="loading-image"
          src="/assets/images/loading.gif"
          alt="Loading"
        /> : null}
      </button>
    </div>;
  }

  renderForgotPasswordForm() {
    return <div>
      {/* Move to back to login page */}
      <span onClick={() => this.setState({view: LOGIN, error: null})}>Back to login</span>

      <p>
        You forgot your password? Enter your email below and we'll send you the old password reset
        email thingy:
      </p>
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

      {this.state.forgotPasswordConfirmation ? <span className="login-forgot-password-message">
        {this.state.forgotPasswordConfirmation}
      </span> : null}

      {/* Submit the form! */}
      <button 
        className={classnames('login-submit-button', {loading: this.state.loading})}
        onClick={this.onForgotPassword.bind(this)}
        type="button"
        disabled={this.state.loading || this.state.email.indexOf('@') === -1}
      >
        <span className="label">Forgot password</span>
        {this.state.loading ? <img
          className="loading-image"
          src="/assets/images/loading.gif"
          alt="Loading"
        /> : null}
      </button>
    </div>;
  }

  render() {
    return <div className="login">
      <div className="login-section">
        <img
          className="login-density-logo"
          src="https://dashboard.density.io/assets/images/density_mark_black.png"
          alt="Density Logo"
        />

        {/* Render any errors with previous login attempts */}
        {this.state.error ? <span className="login-error">
          {this.state.error}
        </span> : null}

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
