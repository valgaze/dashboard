import * as React from 'react';
import { connect } from 'react-redux';

import { InputStackItem, InputStackGroup } from '@density/ui-input-stack';
import Mark from '@density/ui-density-mark';
import Button from '@density/ui-button';
import ErrorBar from '../error-bar/index';

import sessionTokenSet from '../../actions/session-token/set';
import { accounts } from '@density-int/client';

export class AccountRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.invitationData.email,
      invitationToken: this.props.invitationData.invitation_token,

      error: null,

      fullName: '',
      nickname: '',
      password: '',
      passwordConfirmation: '',
    };
  }
  onSubmit() {
    return accounts.users.register({
      email: this.state.email,
      invitation_token: this.state.invitationToken,
      password: this.state.password,
      full_name: this.state.fullName,
      nickname: this.state.nickname || this.generateNickname.apply(this),
    }).then(response => {
      return this.props.onUserLoggedIn(response.session_token);
    }).catch(err => {
      this.setState({error: err.toString()});
    });
  }

  // Generate the default nickname if one isn't specified.
  generateNickname() {
    return this.state.fullName.split(' ')[0];
  }
  render() {
    return <div className="account-registration-container">
      <div className="account-registration">
        <ErrorBar message={this.state.error} showRefresh />

        <Mark className="account-registration-density-logo" />

        <p className="account-registration-lead-in">
          Let's get your account set up, <span className="account-registration-lead-in-email">{this.state.email}</span>!
        </p>

        <InputStackGroup className="account-registration-name-form">
          <InputStackItem
            type="text"
            placeholder="Full Name"
            onChange={e => this.setState({fullName: e.target.value})}
            value={this.state.fullName}
          />
          <InputStackItem
            type="text"
            placeholder={this.state.fullName && this.state.fullName.indexOf(' ') >= 0 ? this.generateNickname.apply(this) : 'Nickname'}
            onChange={e => this.setState({nickname: e.target.value})}
            value={this.state.nickname}
          />
        </InputStackGroup>
        <InputStackGroup className="account-registration-password-form">
          <InputStackItem
            type="password"
            placeholder="Password"
            onChange={e => this.setState({password: e.target.value})}
            value={this.state.password}
          />
          <InputStackItem
            type="password"
            placeholder="Confirm password"
            invalid={this.state.passwordConfirmation.length > 0 ? this.state.password !== this.state.passwordConfirmation : false}
            onChange={e => this.setState({passwordConfirmation: e.target.value})}
            value={this.state.passwordConfirmation}
          />
        </InputStackGroup>

        <br/>
        <Button
          className="account-registration-submit-button"
          size="large"
          onClick={this.onSubmit.bind(this)}
          disabled={!(
            this.state.password.length > 0 &&
            this.state.password === this.state.passwordConfirmation &&
            this.state.fullName.length > 0 && 
            (this.state.fullName.indexOf(' ') >= 0 || this.state.nickname.length > 0) &&
            this.state.email.indexOf('@') >= 0
          )}
        >Create Account</Button>
      </div>
    </div>;
  }
}

export default connect(state => {
  return {invitationData: state.accountRegistration};
}, dispatch => {
  return {
    onUserLoggedIn(token) {
      dispatch(sessionTokenSet(token));
      window.location.hash = '#/spaces';
    },
  };
})(AccountRegistration);
