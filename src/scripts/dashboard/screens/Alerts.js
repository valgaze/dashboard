import React from 'react';
import {connect} from 'react-redux';
import {Switch} from '@blueprintjs/core';

import {SLACK_CLIENT_ID, SLACK_REDIRECT_URI} from 'dashboard/constants';

import {alertsGenerateNewAlert} from 'dashboard/actions/alerts';

import AlertCard from 'dashboard/components/AlertCard';
import Appbar from 'dashboard/components/Appbar';
import Sidebar from 'dashboard/components/Sidebar';

function Alerts({
  slackEnabled,
  slackLoading,
  alerts,
  onToggleSwitch,
  token,
  newAlert,
  onNewAlertClick
}) {

  var slackButton = "";
  if (slackEnabled==false) {
    slackButton = <a href={`https://slack.com/oauth/authorize?scope=channels:read,chat:write:bot&client_id=${SLACK_CLIENT_ID}&redirect_uri=${SLACK_REDIRECT_URI}`} className="sign-in-with-slack"><img src="https://platform.slack-edge.com/img/sign_in_with_slack" srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x" /></a>;
  }
  
  return (
    <div>
      <Appbar />
      <div className="content-section">
        <div className="row">
          <Sidebar />
          <div className="col-xs-24 col-md-20">
            <div className="alerts-section">
              <div className="row">
                <div className="col-xs-20 off-xs-2 col-md-22 off-md-1">
                  <div>
                    <div className="add-new-alert-button">
                      <button className={slackEnabled ? "card circle-button" : "hide"} onClick={onNewAlertClick}>
                        <i className="icon icon-add"></i>
                      </button>
                    </div>
                    <div>
                      <h1>Alerts via </h1><img className="slack-logo" src="/assets/images/slack.png" /><img className={slackLoading ? "loading-image" : "hide"} src="/assets/images/loading.gif" alt="Loading" />
                    </div>
                    {slackButton}
                  </div>
                  <div className="alerts-grid">
                    {(alerts.length == 0 && slackEnabled) ? "Let's add your first alert. Click the blue plus button at the top right of the screen." : ""}
                    {alerts && alerts.map(function(alert, i) {
                      return <AlertCard alert={alert} key={alert.id} />
                    })}
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
  slackEnabled: state.integrations.slackEnabled,
  slackLoading: state.integrations.slackLoading,
  alerts: state.alerts.results,
  token: state.user.token
});

const mapDispatchToProps = dispatch => ({
  onNewAlertClick: () => {
    dispatch(alertsGenerateNewAlert());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
