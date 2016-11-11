import React from 'react';
import {connect} from 'react-redux';

import CopyToClipboard from 'react-copy-to-clipboard';

import Appbar from 'dashboard/components/Appbar'
import Sidebar from 'dashboard/components/Sidebar'
import {tokensGet} from 'dashboard/actions/tokens';
import {spacesGet} from 'dashboard/actions/spaces';
import {doorwaysGet} from 'dashboard/actions/doorways';
import {eventsGet} from 'dashboard/actions/events';

function Tokens(props) {
  const {
    sandboxToken,
    liveToken,
    jwt,
    fetchOrganizationTokens,
    fetchSpaces,
    fetchDoorways,
    fetchEvents,
    spaceCount,
    doorwayCount,
    eventCount
  } = props;
  
  var loading;
  if (!sandboxToken && !liveToken) {
    fetchOrganizationTokens(jwt);
    loading = true;
  } else {
    loading = false;
  }

  // TODO: Find a way to consolidate these...
  if (!spaceCount) {
    fetchSpaces(jwt);
  }

  if (!doorwayCount) {
    fetchDoorways(jwt);
  }

  if (!eventCount) {
    fetchEvents(jwt);
  }

  return (
    <div>
      <Appbar />
      <div className="content-inner">
        <Sidebar />
        <div className="content-panel">
          <div className="tokens-section">
            <div className="row">
              <div className="col-xs-20 off-xs-2 col-md-22 off-md-0">
                <h1>Tokens</h1>
                <h2 className="fun-stat">With {spaceCount} spaces and {doorwayCount} doorways, we've counted {eventCount} events.</h2>
                <div className="row">
                  <div className="col-xs-24 col-md-12">
                    <div className="card token-card">
                      <div className="card-header">
                        <h3 className="card-header-title">Sandbox Token</h3>
                         <CopyToClipboard text={sandboxToken || ""}>
                          <button className="button button-primary button-icon copy-button"><i className="icon-duplicate" /></button>
                        </CopyToClipboard>
                      </div>
                      <div className="card-body">
                        <code>{loading ? "Loading..." : sandboxToken}</code>
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-24 col-md-12">
                    <div className="card token-card">
                      <div className="card-header">
                        <h3 className="card-header-title">Live Token</h3>
                        <CopyToClipboard text={liveToken || ""}>
                          <button className="button button-primary button-icon copy-button"><i className="icon-duplicate" /></button>
                        </CopyToClipboard>
                      </div>
                      <div className="card-body">
                        <code>{loading ? "Loading..." : liveToken}</code>
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
  doorwayCount: state.doorways.count,
  eventCount: state.events.count,
  jwt: state.user.jwt
});

const mapDispatchToProps = dispatch => ({
  fetchOrganizationTokens: (jwt) => {
    dispatch(tokensGet(jwt));
  },
  fetchSpaces: (jwt) => {
    dispatch(spacesGet(jwt));
  },
  fetchDoorways: (jwt) => {
    dispatch(doorwaysGet(jwt));
  },
  fetchEvents: (jwt) => {
    dispatch(eventsGet(jwt, 1, 200));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Tokens);