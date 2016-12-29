import React from 'react';
import {connect} from 'react-redux';

import {rawEventsChangePage, rawEventsSetDateRange, rawEventsFetch} from 'dashboard/actions/raw-events';
import DensityDateRangePicker from 'dashboard/components/DensityDateRangePicker';

function RawEvents({
  spaceId,
  onSetDateRange,
  startDate,
  endDate,
  events,
  pageNum,
  pageSize,
  doorways,
  eventCount,
  onChangePage
}) {
  function entranceOrExit(countChange) {
    return countChange === 1 ? "Entrance" : "Exit"
  }

  function totalPages() {
    return Math.ceil(eventCount/pageSize);
  }

  function doorwayName(doorwayId){
    if(doorways) {
      var doorway = doorways.find(doorway => doorway.id === doorwayId);
      return doorway ? doorway.name : doorwayId;
    } else {
      return doorwayId;
    }
  }
  
  return (
    <div className="raw-events-section">
      <div className="card-top-header">
        <span className="title">Raw Events</span>
      </div>
      <div className="date-range">
        <span className="date-range-text">Date Range:</span>
        <DensityDateRangePicker startDate={startDate} endDate={endDate} onChange={onSetDateRange} />
      </div>
      <div className="card">
        <table className="table striped">
          <thead>
            <tr>
              <td>Time</td>
              <td>Event</td>
              <td>Doorway</td>
              <td>Count</td>
            </tr>
          </thead>
          <tbody>
            {events.map(function(event) {
              return (
                <tr key={event.id}>
                  <td width="30%">{event.timestamp}</td>
                  <td width="20%">{entranceOrExit(event.spaces[0].count_change)}</td>
                  <td width="30%">{doorwayName(event.doorway_id)}</td>
                  <td width="20%">{event.spaces[0].count}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="raw-events-navigation">
        <div>{eventCount} events...</div>
        <div className="page-num">Page {pageNum} of {totalPages()}</div>
        <div className="pt-button-group">
          <button className="pt-button" onClick={onChangePage(1, pageSize, startDate, endDate)}>«</button>
          <button className="pt-button" onClick={onChangePage(pageNum-1, pageSize, startDate, endDate)}>‹</button>
          <button className="pt-button" onClick={onChangePage(pageNum+1, pageSize, startDate, endDate)}>›</button>
          <button className="pt-button" onClick={onChangePage(totalPages(), pageSize, startDate, endDate)}>»</button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  doorways: state.doorways.results,
  startDate: state.rawEvents.startDate,
  endDate: state.rawEvents.endDate,
  events: state.rawEvents.events,
  eventCount: state.rawEvents.count,
  pageNum: state.rawEvents.pageNum
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChangePage: (pageNum, pageSize, startDate, endDate) => () => {
    dispatch(rawEventsChangePage(pageNum, pageSize));
    dispatch(rawEventsFetch(startDate, endDate, pageNum, ownProps.pageSize, ownProps.spaceId));
  },
  onSetDateRange: (value) => {
    dispatch(rawEventsSetDateRange(value));
    dispatch(rawEventsFetch(value[0].format(), value[1].format(), 1, ownProps.pageSize, ownProps.spaceId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RawEvents);