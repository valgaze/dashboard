import React from 'react';
import {connect} from 'react-redux';
import {Switch} from '@blueprintjs/core';

import {alertsToggleEnabled, alertsCancel, alertsUpdateFormField, alertsCreate, alertsDelete, alertsEdit} from 'dashboard/actions/alerts';

function AlertCard({
  alert,
  onToggleSwitch,
  onCancelClick,
  onCreateAlert,
  onEditAlert,
  onSaveAlert,
  onUpdateFormField,
  spaces,
  onDeleteClick,
  channels
}) {

  let enableFields = !(alert.mode == "edit" || alert.mode == "new");

  return (
    <div className="alert-cell">
      <div className="card-top-header">
        <span className="title">Alert via Slack</span>
        <span className={(alert.mode == "edit" || alert.mode == "new") ? "action" : "hide"} onClick={onCancelClick(alert.id)}>Cancel</span>
        <span className={alert.mode == null ? "action primary-action" : "hide"} onClick={onEditAlert(alert.id)}>Edit</span> 
        <span className={alert.mode == "new" ? "action primary-action" : "hide"} onClick={onCreateAlert(alert.compareValue, alert.space_id, alert.enabled, alert.channel)}>Create</span> 
        <span className={alert.mode == "edit" ? "action primary-action" : "hide"} onClick={onSaveAlert(alert.compareValue, alert.space_id, alert.enabled, alert.channel)}>Save</span>
      </div>
      <div className="card">
        <div className="card-header">
          <Switch checked={alert.enabled} label={alert.enabled ? "On" : "Off"} onChange={onToggleSwitch(alert.id, alert.mode, alert.enabled)} className="pt-large" />
          <span className={alert.mode != "new" ? "action" : "hide"} onClick={onDeleteClick(alert.id)}>Remove Alert</span>
        </div>
        <div className="card-body">
          <div className="alert-line">Post to 
            <div className="pt-select pt-large">
              <select onChange={onUpdateFormField('channel', alert.id)} value={alert.channel} disabled={enableFields}>
                <option value="" key="0">Select a channel...</option>;
                {channels && channels.map(function(channel, i) {
                  return <option value={channel.name} key={channel.id}>{channel.name}</option>;
                })}
              </select>
            </div>
          </div>
          <div className="alert-line">when the current count in
            <div className="pt-select pt-large">
              <select onChange={onUpdateFormField('space_id', alert.id)} value={alert.space_id} disabled={enableFields}>
                <option value="" key="0">Select a space...</option>;
                {spaces && spaces.map(function(space, i) {
                  return <option value={space.id} key={space.id}>{space.name}</option>;
                })}
              </select>
            </div>
          </div>
          <div className="alert-line">exceeds 
            <input type="number" defaultValue={alert.compare_value} onChange={onUpdateFormField('compareValue', alert.id)} disabled={enableFields} />
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
  onToggleSwitch: (alertId, mode, enabled) => () => {
    dispatch(alertsToggleEnabled(alertId, mode, enabled));
  },
  onCancelClick: (alertId) => () => {
    dispatch(alertsCancel(alertId));
  },
  onUpdateFormField: (field, alertId) => (event) => {
    dispatch(alertsUpdateFormField(alertId, field, event.target.value));
  },
  onCreateAlert: (compareValue, spaceId, enabled, channel) => () => {
    dispatch(alertsCreate(compareValue, spaceId, enabled, channel));
  },
  onDeleteClick: (alertId) => () => {
    dispatch(alertsDelete(alertId));
  },
  onEditAlert: (alertId) => () => {
    dispatch(alertsEdit(alertId));
  },
  onSaveAlert: (compareValue, spaceId, enabled, channel) => () => {
    console.log("saved");
    // dispatch(alertsCreate(compareValue, spaceId, enabled, channel));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertCard);
