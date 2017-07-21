import * as React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { accounts } from '@density-int/client';

import sessionTokenSet from '../../actions/session-token/set';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.setState({loading: true});
    return accounts.users.login({
      email: this.state.email,
      password: this.state.password,
    }).then(token => {
      this.setState({loading: false});
      this.props.onUserSuccessfullyLoggedIn(token);
    }).catch(error => {
      this.setState({loading: false, error: error.message});
    });
  }

  render() {
    return <div className="login">
      <div className="login-section">
        <img
          className="login-density-logo"
          src="https://dashboard.density.io/assets/images/density_mark_black.png"
          alt="Density Logo"
        />
        <h1>Login</h1>

        {/* Render any errors with previous login attempts */}
        {this.state.error ? <span className="login-error">
          {this.state.error}
        </span> : null}

        {/* Login inputs */}
        <input
          className="login-textbox"
          type="email"
          placeholder="Email Address"
          onChange={e => this.setState({email: e.target.value})}
          onKeyPress={this.onEnter.bind(this)}
          value={this.state.email}
        />
        <input
          className="login-textbox"
          type="password"
          placeholder="Password"
          onChange={e => this.setState({password: e.target.value})}
          onKeyPress={this.onEnter.bind(this)}
          value={this.state.password}
        />
        <button 
          className={classnames('login-submit-button', {loading: this.state.loading})}
          onClick={this.onLogin.bind(this)}
          type="button"
          disabled={this.state.loading}
        >
          <span className="label">Log in</span>
          {this.state.loading ? <img
            className="loading-image"
            src="/assets/images/loading.gif"
            alt="Loading"
          /> : null}
        </button>
      </div>
    </div>;
  }
}


export default connect(state => ({}), dispatch => {
  return {
    onUserSuccessfullyLoggedIn(token) {
      dispatch(sessionTokenSet(token));
      window.location.hash = '#/spaces';
    },
  };
})(Login);
