import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Moment from 'moment';

import Appbar from 'dashboard/components/Appbar';
import Sidebar from 'dashboard/components/Sidebar';
import {eventsGet} from 'dashboard/actions/events';
import {doorwaysGet} from 'dashboard/actions/doorways';
import {spacesGet} from 'dashboard/actions/spaces';

function Events(props) {
  const {
    doorways,
    spaces,
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

  function entranceOrExit(count_change) {
    return count_change === 1 ? "Entrance" : "Exit"
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

  function doorwayName(doorway_id){
    var doorway = doorways.find(doorway => doorway.id === doorway_id);
    return doorway.name;
  }

  function spaceName(space_id){
    var space = spaces.find(space => space.id === space_id);
    return space.name;
  }

  return (
    <div>
      <Appbar />
      <div className="content-inner">
        <Sidebar />
        <div className="content-panel">
          <div className="events-section">
            <div className="row">
              <div className="col-xs-20 off-xs-2 col-md-22 off-md-0">
                <h1>Events</h1>
                <div className="events-list-section">
                  {loading ? "Loading Events..." : events.map(function(event, i) {
                    return (
                      <div className="event-item" key={event.id}>
                        <div className="event-doorway-time">
                          {Moment(event.timestamp).tz(Moment().tz.guess()).format('MMM D (h:mm A)')} / Doorway: {doorwayName(event.doorway_id)}
                        </div>
                        <table className="table data-table">
                          <thead>
                            <tr>
                              <td>Space</td>
                              <td>Event</td>
                              <td>Count</td>
                            </tr>
                          </thead>
                          <tbody>
                            {event.spaces.map(function(space) {
                              return (
                                <tr key={space.space_id}>
                                  <td width="60%">{spaceName(space.space_id)}</td>
                                  <td width="20%">{entranceOrExit(space.count_change)}</td>
                                  <td width="20%">{space.count}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
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
  doorways: state.doorways.results,
  spaces: state.spaces.results,
  eventCount: state.events.count,
  currentPage: ownProps.params.page,
  events: state.events.results,
  jwt: state.user.jwt
});

const mapDispatchToProps = dispatch => ({
  fetchEvents: (jwt, page, pageSize) => {
    dispatch(eventsGet(jwt, page, pageSize))
    dispatch(doorwaysGet(jwt))
    dispatch(spacesGet(jwt))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Events);