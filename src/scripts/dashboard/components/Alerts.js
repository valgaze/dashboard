import React from 'react';
import {connect} from 'react-redux';
import { Switch } from '@blueprintjs/core';

import Appbar from 'dashboard/components/Appbar';
import Sidebar from 'dashboard/components/Sidebar';

function Alerts({
  alerts,
  onToggleSwitch
}) {
  return (
    <div>
      <Appbar />
      <div className="row">
        <Sidebar />
        <div className="col-xs-24 col-md-20">
          <div className="alerts-section">
            <div className="row">
              <div className="col-xs-20 off-xs-2 col-md-22 off-md-1">
                <h1>Alerts via Slack</h1>
                <div className="alerts-grid">
                  {alerts ? null : "Loading..."}
                  {alerts && alerts.map(function(alert, i) {
                    return (
                      <div className="alert-cell" key={alert.id}>
                        <div className="card">
                          <div className="card-header">
                            <Switch checked={alert.enabled} label={alert.enabled ? "On" : "Off"} onChange={onToggleSwitch(alert.id)} className="pt-large" />
                            <span className="action">Remove Integration</span> 
                          </div>
                          <div className="card-body">
                            <div>Post to 
                            <div className="pt-select pt-large">
                              <select>
                                  <option selected>Choose a channel...</option>
                                  <option value="1">#density-alerts</option>
                                  <option value="2">#announcements</option>
                                  <option value="3">#something</option>
                                  <option value="4">#wall</option>
                                </select>
                              </div>

                            </div>
                            <div>when current count in Conference Room</div>
                            <div>exceeds 25 people</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
  alerts: state.alerts.results
});

const mapDispatchToProps = dispatch => ({
  onToggleSwitch: (alertId) => () => {
    console.log(alertId);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
