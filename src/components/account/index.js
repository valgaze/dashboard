import * as React from 'react';
import { connect } from 'react-redux';
import InputBox from '@density/ui-input-box';

import userResetPassword from '../../actions/user/reset-password';

export class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      currentPassword: '',
    };
  }
  render() {
    const {
      user,
      onSubmitPassword,
    } = this.props;

    if (user) {
      return <div className="account">
        <h1>Account</h1>
        <p>Name: {user.firstName} {user.lastName}</p>
        <p>Email: {user.email}</p>

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
        <p>Name: {user.organization.name}</p>
      </div>;
    } else {
      return <p>Loading...</p>;
    }
  }
}

export default connect(state => {
  return {
    user: state.user,
  };
}, dispatch => {
  return {
    onSubmitPassword(currentPassword, password) {
      dispatch(userResetPassword(currentPassword, password));
    },
  };
})(Account);
