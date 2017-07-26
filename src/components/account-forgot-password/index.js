import * as React from 'react';
import { connect } from 'react-redux';

import InputBox from '@density/ui-input-box';

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
      console.log('forgot password respose', response);
      return this.props.onUserLoggedIn(response.session_token);
    }).catch(err => {
      this.setState({error: err.toString()});
    });
  }

  render() {
    return <div className="account-forgot-password">
      {this.state.error ? `Error: ${this.state.error}` : null}

      <div className="account-forgot-password-group">
        <label htmlFor="account-forgot-password-password">Password</label>
        <InputBox
          type="password"
          id="account-forgot-password-password"
          placeholder="correct horse battery staple"
          value={this.state.password}
          onChange={e => this.setState({password: e.target.value})}
        />
      </div>
      <div className="account-forgot-password-group">
        <label htmlFor="account-forgot-password-password-confirmation">Password again</label>
        <InputBox
          type="password"
          id="account-forgot-password-password-confirmation"
          placeholder="correct horse battery staple"
          value={this.state.passwordConfirmation}
          onChange={e => this.setState({passwordConfirmation: e.target.value})}
        />
      </div>

      <br/>
      <button
        onClick={this.onSubmit.bind(this)}
        disabled={!(this.state.password.length > 0 && this.state.password === this.state.passwordConfirmation)}
      >Submit</button>
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
