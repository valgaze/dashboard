import React from 'react';
import {connect} from 'react-redux';

import {
  tokensGet
} from 'dashboard/actions/tokens';

function Tokens(props) {
  const {
    sandboxToken,
    liveToken,
    jwt
  } = props;
  
  if (sandboxToken == null && liveToken == null) {
    getTokens(jwt);
  }

  return (
    <div className="login-section">
      <div className="row">
        <div className="col-xs-20 off-xs-2 col-md-8 off-md-8">
          <h1>Tokens</h1>
          Welcome
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  sandboxToken: state.organization.sandboxToken,
  liveToken: state.organization.liveToken,
  jwt: state.user.jwt
});

const mapDispatchToProps = dispatch => ({
  getTokens: (jwt) => {
    dispatch(tokensGet(jwt));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Tokens);