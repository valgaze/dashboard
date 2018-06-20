import * as React from 'react';
import { connect } from 'react-redux';
import InputBox from '@density/ui-input-box';
import Card, { CardHeader, CardBody, CardLoading } from '@density/ui-card';
import FormLabel from '../form-label/index';
import Button from '@density/ui-button';
import Toast from '@density/ui-toast';

import ModalHeaderActionButton from '../modal-header-action-button/index';
import ErrorBar from '../error-bar/index';

import userResetPassword from '../../actions/user/reset-password';
import userUpdate from '../../actions/user/update';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';

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
      fullName: this.props.user ? this.props.user.fullName : '',
      nickname: this.props.user ? this.props.user.nickname : '',
      email: this.props.user ? this.props.user.email : '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      fullName: nextProps.user.fullName || '',
      nickname: nextProps.user.nickname || '',
      email: nextProps.user.email || '',
    });
  }

  // Generate the default nickname if one isn't specified.
  generateNickname() {
    return this.state.fullName.indexOf(' ') >= 0 ? this.state.fullName.split(' ')[0] : undefined;
  }
  render() {
    const {
      user,
      onSubmitPassword,
      onSubmitUserUpdate,
    } = this.props;

    return <div className="account">
      {/* Render any errors from the server */}
      <ErrorBar message={this.state.error} />

      {this.props.activeModal.name === 'account-password-reset' ? <div className="account-password-reset-toast">
        <Toast
          type="success"
          icon={<span className="account-password-reset-icon">&#xe908;</span>}
          title="Password updated!"
          onDismiss={this.props.onHideSuccessToast}
        >
          Your password has been successfully updated.
        </Toast>
      </div> : null}

      <Card className="account-card" type="modal">
        {this.props.loading ? <CardLoading indeterminate /> : null}
        <CardHeader>
          {this.state.mode === EDIT ? 'Edit Account' : 'Account'}

          {/* Edit / Cancel button */}
          <ModalHeaderActionButton
            onClick={() => {
              // If currently in edit mode, then reset all edits before transitioning back to normal
              // mode.
              if (this.state.mode === EDIT) {
                this.setState({
                  mode: NORMAL,

                  // Reset back to the values in the user prop (what's in redux)
                  fullName: this.props.user.fullName || '',
                  nickname: this.props.user.nickname || '',
                  email: this.props.user.email || '',
                });
              } else {
                this.setState({mode: EDIT});
              }
            }}
            className="account-edit-button"
          >{this.state.mode === EDIT ? 'Cancel' : 'Edit'}</ModalHeaderActionButton>
        </CardHeader>

        <CardBody>
          <div className="account-name-container">
            <FormLabel
              className="account-full-name-container"
              htmlFor="account-full-name"
              label="Full Name"
              input={<InputBox
                type="text"
                placeholder="Full Name"
                value={this.state.fullName}
                onChange={e => this.setState({fullName: e.target.value})}
                disabled={this.state.mode !== EDIT}
                id="account-full-name"
              />}
            />

            <FormLabel
              className="account-nickname-container"
              htmlFor="account-nickname"
              label="Nickname"
              input={<InputBox
                type="text"
                placeholder={this.generateNickname() || 'Nickname'}
                value={this.state.nickname}
                onChange={e => this.setState({nickname: e.target.value})}
                disabled={this.state.mode !== EDIT}
                id="account-nickname"
              />}
            />
          </div>

          <FormLabel
            className="account-email-container"
            htmlFor="account-email"
            label="Email"
            input={<InputBox
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={e => this.setState({email: e.target.value})}
              disabled={true}
              id="account-email"
            />}
          />

          <FormLabel
            className="account-organization-container"
            htmlFor="account-organization"
            label="Organization"
            input={<InputBox
              type="text"
              value={user && user.organization ? user.organization.name : '(unknown organization)'}
              onChange={e => this.setState({email: e.target.value})}
              disabled={true}
              id="account-organization"
            />}
          />

          {/* Trigger changing the password */}
          {this.state.mode === NORMAL ? <FormLabel
            className="account-change-password-link-container"
            label="Password"
            htmlFor="account-change-password"
            input={ <div id="account-change-password" className="account-change-password-value">
              <span onClick={() => this.setState({mode: PASSWORD_RESET})}>Change Password</span>
            </div>}
          /> : null}

          {/* The form to change the password that is triggered. */}
          {this.state.mode === PASSWORD_RESET ? <div className="account-change-password-form-container">
            <label className="account-change-password-form-header">Password</label>
            <InputBox
              type="password"
              placeholder="Type old password"
              value={this.state.currentPassword}
              onChange={e => this.setState({currentPassword: e.target.value})}
            />
            <InputBox
              type="password"
              placeholder="Type new password (minimum of 8 characters)"
              value={this.state.password}
              onChange={e => this.setState({password: e.target.value})}
            />
            <InputBox
              type="password"
              placeholder="Confirm new password"
              value={this.state.passwordConfirmation}
              onChange={e => this.setState({passwordConfirmation: e.target.value})}
            />
            <Button
              onClick={() => {
                if (this.state.password === this.state.passwordConfirmation) {
                  this.setState({error: null});
                  return onSubmitPassword(this.state.currentPassword, this.state.password)
                    .then(() => {
                      this.setState({mode: NORMAL});
                    })
                    .catch(error => {
                      this.setState({ error });
                    });
                } else {
                  this.setState({error: `Passwords don't match.`});
                }
              }}
              disabled={this.state.password.length < 8}
            >Change Password</Button>
          </div> : null}

          <div className="account-submit-user-details">
            {this.state.mode === EDIT ? <Button
              onClick={() => {
                onSubmitUserUpdate(this.state.fullName, this.state.nickname, this.state.email)
                .then(() => {
                  this.setState({mode: NORMAL});
                }).catch(error => {
                  this.setState({error});
                });
              }}
            >Save Changes</Button> : null}
          </div>
        </CardBody>
      </Card>
    </div>;
  }
}

export default connect(state => {
  return {
    user: state.user.data,
    activeModal: state.activeModal,
    loading: state.user.loading,
  };
}, dispatch => {
  return {
    onSubmitPassword(currentPassword, password) {
      return dispatch(userResetPassword(currentPassword, password)).then(() => {
        dispatch(showModal('account-password-reset'));
      });
    },
    onSubmitUserUpdate(fullName, nickname, email) {
      return dispatch(userUpdate(fullName, nickname, email));
    },
    onHideSuccessToast() {
      dispatch(hideModal());
    },
  };
})(Account);
