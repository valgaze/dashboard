import React from 'react';
import {Link} from 'react-router';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      statusText: null
    };
  }

  forgotPasswordFieldUpdate(event) {
    this.setState({email: event.target.value});
  }

  onEnterPressed(event) {
    if (event.key === 'Enter') {
      this.onSubmitPressed();
    }
  }

  onSubmitPressed () {
    this.setState({
      statusText: "Sending password reset email..."
    });
    fetch('https://clerk.density.io/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({email: this.state.email}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status == 403) {
        return response.json().then(({detail}) => {
          throw new Error(detail);
        });
      } else {
        throw new Error(response.statusText);
      }
    }).then((json) => {
      this.setState({
        statusText: "We have sent you a reset-password link. Please check your email."
      });
    }).catch((error) => {
      this.setState({
        statusText: "There was an error. Please try again."
      });
    })
  }

  render() {
    return (
      <div className="container">
        <div className="forgot-password-section">
          <div className="row">
            <div className="col-xs-20 off-xs-2 col-md-8 off-md-8">
              <img className="app-icon" src="/assets/images/density_mark_black.png" alt="Density Logo" />
              <h1>Forgot password?</h1>
              {this.state.statusText}
              <input
                className="form-control"
                type="email"
                placeholder="Email Address"
                onChange={this.forgotPasswordFieldUpdate.bind(this)}
                onKeyPress={this.onEnterPressed.bind(this)}
                defaultValue={this.state.email}
              />
              <button 
                className="button button-primary submit-button"
                onClick={this.onSubmitPressed.bind(this)}
                type="button">
                Submit
              </button>
              <Link to='/login' className="back-to-login-link">Back to Login</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ForgotPassword;