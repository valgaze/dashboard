import * as React from 'react';
import { connect } from 'react-redux';

import InputBox from '@density/ui-input-box';

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
      nickname: this.state.nickname,
    }).then(response => {
      return this.props.onUserLoggedIn(response.session_token);
    }).catch(err => {
      this.setState({error: err.toString()});
    });
  }
  render() {
    return <div className="account-registration">
      {this.state.error ? `Error: ${this.state.error}` : null}
      <div className="account-registration-group">
        <label htmlFor="account-registration-email">Email</label>
        <InputBox
          type="text"
          id="account-registration-email"
          placeholder="email@example.com"
          value={this.state.email}
          onChange={e => this.setState({email: e.target.value})}
        />
      </div>
      <div className="account-registration-group">
        <label htmlFor="account-registration-full-name">
          Full Name (What would the government call you?)
        </label>
        <InputBox
          type="text"
          id="account-registration-full-name"
          placeholder="John Smith"
          value={this.state.fullName}
          onChange={e => this.setState({fullName: e.target.value})}
        />
      </div>
      <div className="account-registration-group">
        <label htmlFor="account-registration-nickname">
          Nickname (What do your friends call you?)
        </label>
        <InputBox
          type="text"
          id="account-registration-nickname"
          placeholder={this.state.fullName && this.state.fullName.indexOf(' ') >= 0 ? this.state.fullName.split(' ')[0] : 'J-dawg'}
          value={this.state.nickName}
          onChange={e => this.setState({nickname: e.target.value})}
        />
      </div>
      <div className="account-registration-group">
        <label htmlFor="account-registration-password">Password</label>
        <InputBox
          type="password"
          id="account-registration-password"
          placeholder="correct horse battery staple"
          value={this.state.password}
          onChange={e => this.setState({password: e.target.value})}
        />
      </div>
      <div className="account-registration-group">
        <label htmlFor="account-registration-password-confirmation">Password again</label>
        <InputBox
          type="password"
          id="account-registration-password-confirmation"
          placeholder="correct horse battery staple"
          value={this.state.passwordConfirmation}
          onChange={e => this.setState({passwordConfirmation: e.target.value})}
        />
      </div>

      <br/>
      <button
        onClick={this.onSubmit.bind(this)}
        disabled={!(
          this.state.password.length > 0 &&
          this.state.password === this.state.passwordConfirmation &&
          this.state.nickname.length > 0 &&
          this.state.fullName.length > 0 &&
          this.state.email.indexOf('@') >= 0
        )}
      >Submit</button>
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
