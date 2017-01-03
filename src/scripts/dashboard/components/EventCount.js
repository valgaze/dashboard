import React from 'react';
import {connect} from 'react-redux';

import {eventCountFetch, eventCountSetDate} from 'dashboard/actions/event-count';
import DensityDatePicker from 'dashboard/components/DensityDatePicker';
import EventCountChart from 'dashboard/components/EventCountChart';


import moment from 'moment';


function EventCount({
  spaceId,
  onSetDate,
  date,
  timestamps,
  counts
}) {
  return (
    <div className="event-count-section">
      <div className="card-top-header">
        <span className="title">24 Hour</span>
      </div>
      <div className="date-picker">
        <span className="date-picker-text">Date:</span>
        <DensityDatePicker date={date} onChange={onSetDate} />
      </div>
      <EventCountChart timestamps={timestamps} counts={counts} />
    </div>
  )
}

const mapStateToProps = state => ({
  date: state.eventCount.date,
  timestamps: state.eventCount.timestamps,
  counts: state.eventCount.counts
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSetDate: (value) => {
    dispatch(eventCountSetDate(value));
    dispatch(eventCountFetch(value, ownProps.spaceId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EventCount);