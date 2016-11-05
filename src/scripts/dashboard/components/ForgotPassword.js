import React from 'react';
import {Link} from 'react-router';

export default function ForgotPassword(props) {
  const {} = props;

  var email;
  var statusText;

  var forgotPasswordFieldUpdate = (event) => {
    email = event.target.value;
    console.log(email);
  }

  var onEnterPressed = () => {
    if (event.key === 'Enter') {
      onSubmitPressed();
    }
  }

  var onSubmitPressed = () => {
    fetch('https://clerk.density.io/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({email: email}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else if (response.status == 403) {
        return response.json().then(({detail}) => {
          throw new Error(detail);
        });
      } else {
        throw new Error(response.statusText);
      }
    }).then(function(json) {
      statusText = "We have sent you a reset-password link. Please check your email.";
      console.log("Success!");
    }).catch(function(error) {
      statusText = "There was an error. Please try again.";
      console.log("Fail!");
    })
  }

  return (
    <div className="container">
      <div className="forgot-password-section">
        <div className="row">
          <div className="col-xs-20 off-xs-2 col-md-8 off-md-8">
            <h1>Forgot password?</h1>
            {statusText}
            <input
              className="form-control"
              type="email"
              placeholder="Email Address"
              onChange={forgotPasswordFieldUpdate}
              onKeyPress={onEnterPressed}
              defaultValue={email}
            />
            <button 
              className="button button-primary submit-button"
              onClick={onSubmitPressed}
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