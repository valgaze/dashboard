import React from 'react';
import {connect} from 'react-redux';

function Login(props) {
  const {
    sandboxToken,
    liveToken,
  } = props;

  return (
    <div className="login-section">
      <div className="row">
        <div className="col-xs-20 off-xs-2 col-md-8 off-md-8">
          <h1>Tokens</h1>
          Welcome {sandboxToken} {liveToken}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  sandboxToken: state.organization.sandboxToken,
  liveToken: state.organization.liveToken,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Login);