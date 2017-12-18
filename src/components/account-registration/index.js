import * as React from 'react';
import { connect } from 'react-redux';

import Mark from '@density/ui-density-mark';
import Button from '@density/ui-button';
import Navbar from '@density/ui-navbar';
import InputBox from '@density/ui-input-box';

import Card, { CardBody } from '@density/ui-card';

import ErrorBar from '../error-bar/index';
import AccountSetupHeader from '../account-setup-header/index';

import sessionTokenSet from '../../actions/session-token/set';
import { accounts } from '../../client';

import unsafeNavigateToLandingPage from '../../helpers/unsafe-navigate-to-landing-page/index';

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
    return <div className="account-registration">
      <Navbar />

      <ErrorBar message={this.state.error} showRefresh />

      <AccountSetupHeader
        greeter="Create your account"
        detail={`Lets get your Density account set up, ${this.state.email}!`}
      />

      <Mark className="account-registration-density-logo" />

      <div className="account-registration-card-container">
        <Card className="account-registration-card">
          <CardBody>
            <label htmlFor="account-registration-full-name">Full Name</label>
            <InputBox
              type="text"
              placeholder="Full Name ..."
              onChange={e => this.setState({fullName: e.target.value})}
              value={this.state.fullName}
            />

            <label htmlFor="account-registration-nickname">Nickname</label>
            <InputBox
              type="text"
              placeholder={
                this.state.fullName && this.state.fullName.indexOf(' ') >= 0 ? this.generateNickname.apply(this) : 'Nickname ...'
              }
              onChange={e => this.setState({nickname: e.target.value})}
              value={this.state.nickname}
            />

            <label htmlFor="account-registration-confirm-password">Password</label>
            <InputBox
              type="password"
              placeholder="Password"
              onChange={e => this.setState({password: e.target.value})}
              value={this.state.password}
            />

            <label htmlFor="account-registration-confirm-password">Confirm Password</label>
            <InputBox
              type="password"
              placeholder="Confirm password"
              onChange={e => this.setState({passwordConfirmation: e.target.value})}
              value={this.state.passwordConfirmation}
            />

            <br />
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
          </CardBody>
        </Card>
      </div>
    </div>;
  }
}

export default connect(state => {
  return {invitationData: state.accountRegistration};
}, dispatch => {
  return {
    onUserLoggedIn(token) {
      dispatch(sessionTokenSet(token)).then(user => {
        unsafeNavigateToLandingPage(user.organization.settings.insightsPageLocked);
      });
    },
  };
})(AccountRegistration);
