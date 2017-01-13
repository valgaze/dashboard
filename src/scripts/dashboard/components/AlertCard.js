import React from 'react';
import {connect} from 'react-redux';
import {Switch} from '@blueprintjs/core';

import {alertsToggleEnabled} from 'dashboard/actions/alerts';

function AlertCard({
  alert,
  onToggleSwitch
}) {
  return (
    <div className="alert-cell">
      <div className="card">
        <div className="card-header">
          <Switch checked={alert.enabled} label={alert.enabled ? "On" : "Off"} onChange={onToggleSwitch(alert.id)} className="pt-large" />
          
          <span className="action">Create</span>
          <span className="action">Cancel</span>

          <span className="action">Edit</span>
          <span className="action">Delete</span>

          <span className="action">Save</span>
          <span className="action">Cancel</span>

        </div>
        <div className="card-body">
          <div className="alert-line">Post to 
            <div className="pt-select pt-large">
              <select>
                <option value="1">#density-alerts</option>
                <option value="2">#announcements</option>
                <option value="3">#something</option>
                <option value="4">#wall</option>
              </select>
            </div>
          </div>
          <div className="alert-line">when the current count in
            <div className="pt-select pt-large">
              <select>
                <option value="1">Conference Room</option>
                <option value="2">Main Office</option>
              </select>
            </div>
          </div>
          <div className="alert-line">exceeds 
            <input type="number" defaultValue="" />
            people
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  alert: ownProps.alert
});

const mapDispatchToProps = dispatch => ({
  onToggleSwitch: (alertId) => () => {
    dispatch(alertsToggleEnabled(alertId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertCard);