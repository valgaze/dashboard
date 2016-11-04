import React from 'react';
import {connect} from 'react-redux';

import {
  tokensGet
} from 'dashboard/actions/tokens';

function Tokens(props) {
  const {
    sandboxToken,
    liveToken,
    jwt,
    fetchOrganizationTokens
  } = props;
  
  var loading;
  if (sandboxToken == null && liveToken == null) {
    fetchOrganizationTokens(jwt);
    loading = true;
  } else {
    loading = false;
  }

  return (
    <div className="login-section">
      <div className="row">
        <div className="col-xs-20 off-xs-2 col-md-8 off-md-8">
          <h1>Tokens</h1>
          <div>
            Sandbox Token: {loading ? "Loading" : sandboxToken}
          </div>
          <div>
            Live Token: {loading ? "Loading" : liveToken}
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  sandboxToken: state.tokens.sandbox,
  liveToken: state.tokens.live,
  jwt: state.login.jwt
});

const mapDispatchToProps = dispatch => ({
  fetchOrganizationTokens: (jwt) => {
    dispatch(tokensGet(jwt));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Tokens);