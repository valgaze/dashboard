import React from 'react';
import {connect} from 'react-redux';

import DensityDatePicker from 'dashboard/components/DensityDatePicker';
import {hourlyCountSetDate} from 'dashboard/actions/hourly-count';

function HourlyCount({
  spaceId,
  onSetDate,
  date
}) {
  return (
    <div className="hourly-count-section">
      <div className="card-top-header">
        <span className="title">24 Hour</span>
      </div>
      <div className="date-picker">
        <span className="date-picker-text">Date:</span>
        <DensityDatePicker date={date} onChange={onSetDate} />
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  date: state.hourlyCount.date
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSetDate: (value) => {
    dispatch(hourlyCountSetDate(value));
    // dispatch(hourlyCountFetch(ownProps.spaceId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HourlyCount);