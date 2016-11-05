import React from 'react';
import {connect} from 'react-redux';

import Sidebar from './sidebar'
import {tokensGet} from 'dashboard/actions/tokens';
import {spacesGet} from 'dashboard/actions/spaces';

function Tokens(props) {
  const {
    sandboxToken,
    liveToken,
    jwt,
    fetchOrganizationTokens,
    fetchSpaces,
    spaceCount
  } = props;
  
  var loading;
  if (!sandboxToken && !liveToken) {
    fetchOrganizationTokens(jwt);
    loading = true;
  } else {
    loading = false;
  }

  if (!spaceCount) {
    fetchSpaces(jwt);
  }

  return (

    <div className="content-inner">
      <Sidebar />
      <div className="content-panel">
        <div className="tokens-section">
          <div className="container">
            <div className="row">
              <div className="col-xs-20 off-xs-2 col-md-20">
                <h1>Tokens</h1>
                <h2 className="fun-stat">With {spaceCount} spaces, 23 doorways, we've counted 3421 events.</h2>
                <div className="row">
                  <div className="col-xs-24 col-md-12">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-header-title">Sandbox Token</h3>
                      </div>
                      <div className="card-body">
                        {loading ? "Loading" : sandboxToken}
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-24 col-md-12">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-header-title">Live Token</h3>
                      </div>
                      <div className="card-body">
                        {loading ? "Loading" : liveToken}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  sandboxToken: state.organization.sandboxToken,
  liveToken: state.organization.liveToken,
  spaceCount: state.spaces.count,
  jwt: state.user.jwt
});

const mapDispatchToProps = dispatch => ({
  fetchOrganizationTokens: (jwt) => {
    dispatch(tokensGet(jwt));
  },
  fetchSpaces: (jwt) => {
    dispatch(spacesGet(jwt));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Tokens);