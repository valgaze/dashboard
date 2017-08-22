import * as React from 'react';
import { connect } from 'react-redux';

import Button from '@density/ui-button';
import Mark from '@density/ui-density-mark';
import { InputStackItem, InputStackGroup } from '@density/ui-input-stack';
import ErrorBar from '../error-bar/index';

import sessionTokenSet from '../../actions/session-token/set';
import { accounts } from '@density-int/client';

export class AccountRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,

      password: '',
      passwordConfirmation: '',
    };
  }
  onSubmit() {
    return accounts.users.password_reset({
      reset_token: this.props.forgotPasswordToken,
      new_password: this.state.password,
      confirm_password: this.state.password,
    }).then(response => {
      return this.props.onUserLoggedIn(response.session_token);
    }).catch(err => {
      this.setState({error: err.toString()});
    });
  }

  render() {
    return <div className="account-forgot-password">
      <ErrorBar message={this.state.error} showRefresh />

      <Mark className="account-forgot-password-mark" />

      <p className="account-forgot-password-lead-in">
        Password change request:
      </p>

      <InputStackGroup className="account-forgot-password-form">
        <InputStackItem
          type="password"
          placeholder="New Password"
          value={this.state.password}
          onChange={e => this.setState({password: e.target.value})}
        />
        <InputStackItem
          type="password"
          placeholder="Confirm Password"
          invalid={this.state.passwordConfirmation.length > 0 && this.state.password !== this.state.passwordConfirmation}
          value={this.state.passwordConfirmation}
          onChange={e => this.setState({passwordConfirmation: e.target.value})}
        />
      </InputStackGroup>

      <Button
        onClick={this.onSubmit.bind(this)}
        disabled={!(this.state.password.length > 0 && this.state.password === this.state.passwordConfirmation)}
        size="large"
      >Update Password</Button>
    </div>;
  }
}

export default connect(state => {
  return {forgotPasswordToken: state.accountForgotPassword};
}, dispatch => {
  return {
    onUserLoggedIn(token) {
      dispatch(sessionTokenSet(token));
      window.location.hash = '#/spaces';
    },
  };
})(AccountRegistration);
