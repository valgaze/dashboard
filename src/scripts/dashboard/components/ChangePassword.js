import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import Appbar from 'dashboard/components/Appbar'
import Sidebar from 'dashboard/components/Sidebar'
import {ACCOUNTS_URL} from 'dashboard/constants';
import {logoutUser} from 'dashboard/actions/logout'

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: null,
      newPassword: null,
      newPasswordConfirm: null,
      statusText: null
    };
  }

  changePasswordFieldUpdate(event) {
    var field = event.target.dataset.field;
    Object.assign(this.state, {[field]: event.target.value});
  }

  onEnterPressed(event) {
    if (event.key === 'Enter') {
      this.onSubmitPressed();
    }
  }

  onSubmitPressed() {
    this.setState({statusText: "Updating your password..."});
    fetch(`${ACCOUNTS_URL}/password_change/`, {
      method: 'POST',
      body: JSON.stringify({
        old_password: this.state.oldPassword,
        new_password: this.state.newPassword,
        confirm_password: this.state.newPasswordConfirm
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.token}`
      },
    })
    .then((response) => {
      if (response.ok) {
        // this.setState({statusText: "We have successfully updated your password."});
        this.props.triggerLogOut();
      } else if (response.status == 403) {
        return response.json().then(({detail}) => {
          throw new Error(detail);
        });
      } else {
        throw new Error(response.statusText);
      }
    }).catch((error) => {
      this.setState({statusText: error.message});
    })
  }

  render() {
    return (
      <div>
        <Appbar />
        <div className="row">
          <Sidebar />
          <div className="col-xs-24 col-md-20">
            <div className="change-password-section">
              <div className="row">
                <div className="col-xs-20 off-xs-2 col-md-8 off-md-1">
                  <h1>Change your password</h1>
                    {this.state.statusText}
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Old Password"
                      data-field="oldPassword"
                      onChange={this.changePasswordFieldUpdate.bind(this)}
                      onKeyPress={this.onEnterPressed.bind(this)}
                      defaultValue={this.state.oldPassword}
                    />
                    <input
                      className="form-control"
                      type="password"
                      data-field="newPassword"
                      placeholder="New Password"
                      onChange={this.changePasswordFieldUpdate.bind(this)}
                      onKeyPress={this.onEnterPressed.bind(this)}
                      defaultValue={this.state.oldPassword}
                    />
                    <input
                      className="form-control"
                      type="password"
                      data-field="newPasswordConfirm"
                      placeholder="New Password (Confirm)"
                      onChange={this.changePasswordFieldUpdate.bind(this)}
                      onKeyPress={this.onEnterPressed.bind(this)}
                      defaultValue={this.state.oldPassword}
                    />
                    <button 
                      className="button button-primary submit-button"
                      onClick={this.onSubmitPressed.bind(this)}
                      type="button">
                      Submit
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  token: state.user.token
});

const mapDispatchToProps = dispatch => ({
  triggerLogOut: () => {
    dispatch(logoutUser());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);