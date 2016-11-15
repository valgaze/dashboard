import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Moment from 'moment';

import Appbar from 'dashboard/components/Appbar';
import Sidebar from 'dashboard/components/Sidebar';
import {eventsGet} from 'dashboard/actions/events';

function Events(props) {
  const {
    eventCount,
    currentPage,
    jwt,
    fetchEvents,
    events
  } = props;

  var pageSize = 10;
  var maxPage = Math.round(eventCount/pageSize);
  var nextPage = Math.min(maxPage, parseInt(currentPage)+1);
  var prevPage = Math.max(1, parseInt(currentPage)-1);
  var loading;
  if(!events) {
    fetchPageEvents(currentPage);
    loading = true;
  } else {
    loading = false;
  }

  function fetchPageEvents(page) {
    fetchEvents(jwt, page, pageSize);
  }

  function fetchNextPage(){
    fetchPageEvents(nextPage);
  }

  function fetchPrevPage(){
    fetchPageEvents(prevPage);
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
                    {loading ? null : events.map(function(event, i) {
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
                <ul className="nav nav-tabs data-table-nav">
                  <li><Link to={'/events/'+prevPage} onClick={fetchPrevPage} className="">&laquo;</Link></li>
                  <li className="active"><Link to={'/events/'+currentPage} className="">{currentPage}</Link></li>
                  <li><Link to={'/events/'+nextPage} onClick={fetchNextPage} className="">&raquo;</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  eventCount: state.events.count,
  currentPage: ownProps.params.page,
  events: state.events.results,
  jwt: state.user.jwt
});

const mapDispatchToProps = dispatch => ({
  fetchEvents: (jwt, page, pageSize) => {
    dispatch(eventsGet(jwt, page, pageSize))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Events);