import React from 'react';
import {connect} from 'react-redux';
import {Switch} from '@blueprintjs/core';

import {alertsToggleEnabled, alertsCancelCreation, alertsUpdateFormField, alertsCreate, alertsDelete} from 'dashboard/actions/alerts';

function AlertCard({
  alert,
  onToggleSwitch,
  onCancelCreate,
  onCreateAlert,
  onUpdateFormField,
  spaces,
  onDeleteClick,
  channels
}) {

  var actions;
  if (alert.state === "new") {
    actions = <div>
      <span className="action primary-action" onClick={onCreateAlert(alert.compareValue, alert.space_id, alert.enabled, alert.channel)}>Create</span>
      <span className="action" onClick={onCancelCreate(alert.id)}>Cancel</span>
    </div>;
  } else if (alert.state === "edit") {
    actions = <div><span className="action" onClick={onDeleteClick(alert.id)}>Delete</span></div>;
    {/* actions = <div>
       <span className="action primary-action">Save</span>
       <span className="action">Cancel</span>
     </div>; */}
  } else {
    actions = <div>
      {/*<span className="action primary-action">Edit</span>*/}
      <span className="action" onClick={onDeleteClick(alert.id)}>Delete</span>
    </div>;
  }

  return (
    <div className="alert-cell">
      <div className="card">
        <div className="card-header">
          <Switch checked={alert.enabled} label={alert.enabled ? "On" : "Off"} onChange={onToggleSwitch(alert.id)} className="pt-large" />
          {actions}
        </div>
        <div className="card-body">
          <div className="alert-line">Post to 
            <div className="pt-select pt-large">
              <select onChange={onUpdateFormField('channel', alert.id)} value={alert.channel}>
                <option value="" key="0">Select a channel...</option>;
                {channels && channels.map(function(channel, i) {
                  return <option value={channel.name} key={channel.id}>{channel.name}</option>;
                })}
              </select>
            </div>
          </div>
          <div className="alert-line">when the current count in
            <div className="pt-select pt-large">
              <select onChange={onUpdateFormField('space_id', alert.id)} value={alert.space_id}>
                <option value="" key="0">Select a space...</option>;
                {spaces && spaces.map(function(space, i) {
                  return <option value={space.id} key={space.id}>{space.name}</option>;
                })}
              </select>
            </div>
          </div>
          <div className="alert-line">exceeds 
            <input type="number" defaultValue={alert.compare_value} onChange={onUpdateFormField('compareValue', alert.id)} />
            people
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  alert: ownProps.alert,
  spaces: state.spaces.results,
  channels: state.integrations.slackChannels
});

const mapDispatchToProps = dispatch => ({
  onToggleSwitch: (alertId) => () => {
    dispatch(alertsToggleEnabled(alertId));
  },
  onCancelCreate: (alertId) => () => {
    dispatch(alertsCancelCreation(alertId));
  },
  onUpdateFormField: (field, alertId) => (event) => {
    dispatch(alertsUpdateFormField(alertId, field, event.target.value));
  },
  onCreateAlert: (compareValue, spaceId, enabled, channel) => () => {
    dispatch(alertsCreate(compareValue, spaceId, enabled, channel));
  },
  onDeleteClick: (alertId) => () => {
    dispatch(alertsDelete(alertId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertCard);
