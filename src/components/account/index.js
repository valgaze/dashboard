import * as React from 'react';
import { connect } from 'react-redux';
import InputBox from '@density/ui-input-box';
import Card, { CardHeader, CardBody } from '@density/ui-card';

import ModalHeaderActionButton from '../modal-header-action-button/index';

import userResetPassword from '../../actions/user/reset-password';
import userUpdate from '../../actions/user/update';

export class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      password: '',
      currentPassword: '',

      // Initialize with a prop passing the initial value from the store
      firstName: this.props.initialUser.firstName,
      lastName: this.props.initialUser.lastName,
      email: this.props.initialUser.email,
    };
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
            onClick={() => this.setState({isEditing: !this.state.isEditing})}
            className="account-edit-button"
          >{this.state.isEditing ? 'Cancel' : 'Edit'}</ModalHeaderActionButton>
        </CardHeader>

        <CardBody>
          <label htmlFor="account-first-name">First Name</label>
          <InputBox
            type="text"
            placeholder="First Name"
            value={this.state.firstName}
            onChange={e => this.setState({firstName: e.target.value})}
            disabled={!this.state.isEditing}
            id="account-first-name"
          />

          <label htmlFor="account-last-name">Last Name</label>
          <InputBox
            type="text"
            placeholder="Last Name"
            value={this.state.lastName}
            onChange={e => this.setState({lastName: e.target.value})}
            disabled={!this.state.isEditing}
            id="account-last-name"
          />

          <label htmlFor="account-email">Email</label>
          <InputBox
            type="text"
            placeholder="Email"
            value={this.state.email}
            onChange={e => this.setState({email: e.target.value})}
            disabled={!this.state.isEditing}
            id="account-email"
          />

          <button
            onClick={() => onSubmitUserUpdate(
              this.state.firstName,
              this.state.lastName,
              this.state.email,
            )}
          >Submit</button>

          <h2>Reset Password</h2>
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
          <button
            onClick={() => onSubmitPassword(this.state.currentPassword, this.state.password)}
          >Submit</button>

          <h1>Organization</h1>
          <p>Name: {initialUser.organization.name}</p>
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
    onSubmitUserUpdate(firstName, lastName, email) {
      dispatch(userUpdate(firstName, lastName, email));
    },
  };
})(function AccountWrapper(props) {
  if (props.initialUser) {
    return <Account {...props} />;
  } else {
    return <p>Loading...</p>;
  }
});
