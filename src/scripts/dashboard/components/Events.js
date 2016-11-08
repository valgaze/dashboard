import React from 'react';
import {connect} from 'react-redux';

import Moment from 'moment';

import Appbar from 'dashboard/components/Appbar';
import Sidebar from 'dashboard/components/Sidebar';
import {eventsGet} from 'dashboard/actions/events';

function Events(props) {
  const {
    jwt,
    fetchEvents,
    events,
  } = props;
  
  var loading;
  if(!events) {
    loading = true;
    fetchEvents(jwt);
  } else {
    loading = false;
    setTimeout(function(){
      fetchEvents(jwt);
    }, 1000);
  }
  
  return (
    <div>
      <Appbar />
      <div className="content-inner">
        <Sidebar />
        <div className="content-panel">
          <div className="tokens-section">
            <div className="container">
              <div className="row">
                <div className="col-xs-20 off-xs-2 col-md-20">
                  <h1>Events</h1>
                  {loading ? "Loading Events..." : null}
                  <table className="table data-table">
                    <thead>
                      <tr>
                        <td>Sensor ID</td>
                        <td>Doorway ID</td>
                        <td>Timestamp</td>
                        <td>Count Change</td>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? null : events.reverse().map(function(event, i) {
                        return (
                          <tr key={event.id}>
                            <td>{event.sensor_id}</td>
                            <td>{event.doorway_id}</td>
                            <td>{Moment(event.timestamp).format('MMM D, h:mm:ss A Z')}</td>
                            <td>{event.spaces.map(function(space) {
                                  return space.count_change
                                })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
  events: state.events.results,
  jwt: state.user.jwt
});

const mapDispatchToProps = dispatch => ({
  fetchEvents: (jwt) => {
    dispatch(eventsGet(jwt))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Events);