import * as React from 'react';
import { connect } from 'react-redux';
import InputBox from '@density/ui-input-box';
import Card, { CardHeader, CardBody } from '@density/ui-card';

import ModalHeaderActionButton from '../modal-header-action-button/index';

import userResetPassword from '../../actions/user/reset-password';
import userUpdate from '../../actions/user/update';

export const NORMAL = 0;
export const EDIT = 1;
export const PASSWORD_RESET = 2;

export class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: NORMAL,

      error: null,
      password: '',
      currentPassword: '',
      passwordConfirmation: '',

      // Initialize with a prop passing the initial value from the store
      fullName: this.props.initialUser.fullName || '',
      nickname: this.props.initialUser.nickname || '',
      email: this.props.initialUser.email || '',
    };
  }
  // Generate the default nickname if one isn't specified.
  generateNickname() {
    return this.state.fullName.indexOf(' ') >= 0 ? this.state.fullName.split(' ')[0] : undefined;
  }
  render() {
    const {
      initialUser,
      onSubmitPassword,
      onSubmitUserUpdate,
    } = this.props;

    return <div className="account">
      <Card>
        <CardHeader>
          Account

          {/* Edit / Cancel button */}
          <ModalHeaderActionButton
            onClick={() => this.setState({mode: this.state.mode === EDIT ? NORMAL : EDIT})}
            className="account-edit-button"
          >{this.state.mode === EDIT ? 'Cancel' : 'Edit'}</ModalHeaderActionButton>
        </CardHeader>

        <CardBody>
          <ul>
            <li className="account-error">
              {this.state.error}
            </li>

            <li className="account-full-name-container">
              <label htmlFor="account-full-name">Full Name</label>
              <InputBox
                type="text"
                placeholder="Full Name"
                value={this.state.fullName}
                onChange={e => this.setState({fullName: e.target.value})}
                disabled={this.state.mode !== EDIT}
                id="account-full-name"
              />
            </li>

            <li className="account-nickname-container">
              <label htmlFor="account-nickname">Nickname</label>
              <InputBox
                type="text"
                placeholder={this.generateNickname() || 'Nickname'}
                value={this.state.nickname}
                onChange={e => this.setState({nickname: e.target.value})}
                disabled={this.state.mode !== EDIT}
                id="account-nickname"
              />
            </li>

            <li className="account-email-container">
              <label htmlFor="account-email">Email</label>
              <InputBox
                type="email"
                placeholder="Email"
                value={this.state.email}
                onChange={e => this.setState({email: e.target.value})}
                disabled={this.state.mode !== EDIT}
                id="account-email"
              />
            </li>

            <li className="account-organization-container">
              <label htmlFor="account-organization">Organization</label>
              <div
                id="account-organization"
                className="account-organization"
              >{initialUser.organization ? initialUser.organization.name : '(unknown organization)'}</div>
            </li>

            {/* Trigger changing the password */}
            <li className="account-change-password-link-container">
              {this.state.mode === NORMAL && <label htmlFor="account-change-password">Password</label>}
              {this.state.mode === NORMAL && <div id="account-change-password" className="account-change-password-value">
                <span onClick={() => this.setState({mode: PASSWORD_RESET})}>Reset Password</span>
              </div>}
            </li>

            {/* The form to change the password that is triggered. */}
            {this.state.mode === PASSWORD_RESET ? <li
              className="account-change-password-form-container"
            >
              <label>Password</label>
              <InputBox
                type="password"
                placeholder="Type old password"
                value={this.state.currentPassword}
                onChange={e => this.setState({currentPassword: e.target.value})}
              />
              <InputBox
                type="password"
                placeholder="Type new password"
                value={this.state.password}
                onChange={e => this.setState({password: e.target.value})}
              />
              <InputBox
                type="password"
                placeholder="Confirm new password"
                value={this.state.passwordConfirmation}
                onChange={e => this.setState({passwordConfirmation: e.target.value})}
              />
              <button
                onClick={() => {
                  if (this.state.currentPassword === this.state.passwordConfirmation) {
                    this.setState({error: null});
                    return onSubmitPassword(this.state.currentPassword, this.state.password)
                  } else {
                    this.setState({error: `Passwords don't match.`});
                  }
                }}
              >Submit Password</button>
            </li> : null}

            <li className="account-submit-user-details">
              {this.state.mode === EDIT ? <button
                onClick={() => {
                  onSubmitUserUpdate(this.state.fullName, this.state.nickname, this.state.email)
                  .then(() => {
                    this.setState({mode: NORMAL});
                  })
                }}
              >Submit User Details</button> : null}
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>;
  }
}

export default connect(state => {
  return {
    initialUser: state.user.user,
  };
}, dispatch => {
  return {
    onSubmitPassword(currentPassword, password) {
      dispatch(userResetPassword(currentPassword, password));
    },
    onSubmitUserUpdate(fullName, nickname, email) {
      return dispatch(userUpdate(fullName, nickname, email));
    },
  };
})(function AccountWrapper(props) {
  if (props.initialUser) {
    return <Account {...props} />;
  } else {
    return <p>Loading...</p>;
  }
});
