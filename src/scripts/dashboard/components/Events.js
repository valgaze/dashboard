import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {push} from 'react-router-redux';
import Moment from 'moment';

import Appbar from 'dashboard/components/Appbar';
import Sidebar from 'dashboard/components/Sidebar';

function Events({
  doorways,
  spaces,
  eventCount,
  currentPage,
  events,
  onNavigateToPage,
}) {
  const pageSize = 10;
  const maxPage = Math.round(eventCount/pageSize);
  const nextPage = Math.min(maxPage, parseInt(currentPage)+1);
  const prevPage = Math.max(1, parseInt(currentPage)-1);

  function entranceOrExit(countChange) {
    return countChange === 1 ? "Entrance" : "Exit"
  }

  function doorwayName(doorwayId){
    if(doorways) {
      var doorway = doorways.find(doorway => doorway.id === doorwayId);
      return doorway ? doorway.name : doorwayId;
    } else {
      return doorwayId;
    }
  }

  function spaceName(spaceId){
    if(spaces) {
      var space = spaces.find(space => space.id === spaceId);
      return space ? space.name : spaceId;
    } else {
      return spaceId;
    }
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
                  {!events ? "Loading Events..." : events.map(function(event, i) {
                    return (
                      <div className="event-item" key={event.id}>
                        <div className="event-doorway-time">
                          {Moment(event.timestamp).format('MMM D (h:mm A)')} / Doorway: {doorwayName(event.doorway_id)}
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
                  <li><button onClick={onNavigateToPage.bind(null, prevPage)} className="">&laquo;</button></li>
                  <li className="active"><Link to={'/events/'+currentPage} className="">{currentPage}</Link></li>
                  <li><button onClick={onNavigateToPage.bind(null, nextPage)} className="">&raquo;</button></li>
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
});

const mapDispatchToProps = dispatch => ({
  onNavigateToPage(pageNum) {
    dispatch(push(`/#/events/${pageNum}`));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Events);