import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import {eventCountFetch, eventCountSetDate} from 'dashboard/actions/event-count';
import DensityDatePicker from 'dashboard/components/DensityDatePicker';
import EventCountChart from 'dashboard/components/EventCountChart';

function EventCount({
  spaceId,
  onSetDate,
  date,
  timestamps,
  counts,
  loading
}) {
  return (
    <div className="event-count-section">
      <div className="card-top-header">
        <span className="title">24 Hour</span>
      </div>
      <div className="date-picker">
        <div className="date-picker-text">Date:</div>
        <DensityDatePicker date={date} onChange={onSetDate} />
        <img className={loading ? "loading-image" : "hide"} src="/assets/images/loading.gif" alt="Loading" />
      </div>
      <EventCountChart timestamps={timestamps} counts={counts} />
    </div>
  )
}

const mapStateToProps = state => ({
  date: state.eventCount.date,
  timestamps: state.eventCount.timestamps,
  counts: state.eventCount.counts,
  loading: state.eventCount.loading
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSetDate: (value) => {
    dispatch(eventCountSetDate(value));
    dispatch(eventCountFetch(value, ownProps.spaceId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EventCount);