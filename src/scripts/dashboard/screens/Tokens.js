import React from 'react';
import {connect} from 'react-redux';
import CopyToClipboard from 'react-copy-to-clipboard';

import Appbar from 'dashboard/components/Appbar'
import Sidebar from 'dashboard/components/Sidebar'

function Tokens({
  orgToken,
  spaceCount,
  doorwayCount,
  eventCount
}) {  
  return (
    <div className="">
      <Appbar />
      <div className="content-section">
        <div className="row">
        <Sidebar />
        <div className="col-xs-24 col-md-20">
          <div className="tokens-section">
            <div className="row">
              <div className="col-xs-20 off-xs-2 col-md-22 off-md-1">
                <h1>Tokens</h1>
                <h2 className="fun-stat">With {spaceCount} spaces and {doorwayCount} doorways, we have counted {eventCount} events.</h2>
                <div className="row">
                  <div className="col-xs-24 col-md-12">
                    <div className="card token-card">
                      <div className="card-header">
                        <h3 className="card-header-title">API Token</h3>
                         <CopyToClipboard text={orgToken || ''}>
                          <button className="button button-primary button-icon copy-button"><i className="icon-duplicate" /></button>
                        </CopyToClipboard>
                      </div>
                      <div className="card-body">
                        <code>{!orgToken ? "Loading..." : orgToken}</code>
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
    </div>
  )
}

const mapStateToProps = state => ({
  orgToken: state.organization.orgToken,
  spaceCount: state.spaces.count,
  doorwayCount: state.doorways.count,
  eventCount: state.events.count
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Tokens);