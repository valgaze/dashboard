import * as React from 'react';
import { connect } from 'react-redux';
import InputBox from '@density/ui-input-box';

import userResetPassword from '../../actions/user/reset-password';
import userUpdate from '../../actions/user/update';

export class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      <h1>Account</h1>

      <label>Name</label>
      <div className="account-name">
        <InputBox
          type="text"
          placeholder="First Name"
          value={this.state.firstName}
          onChange={e => this.setState({firstName: e.target.value})}
        />
        <InputBox
          type="text"
          placeholder="Last Name"
          value={this.state.lastName}
          onChange={e => this.setState({lastName: e.target.value})}
        />
      </div>

      <label>Email</label>
      <InputBox
        type="text"
        placeholder="Email"
        value={this.state.email}
        onChange={e => this.setState({email: e.target.value})}
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
    </div>;
  }
}

export default connect(state => {
  return {
    initialUser: state.user,
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
