import React from 'react';
import {connect} from 'react-redux';

import TotalVisitsChart from 'dashboard/components/TotalVisitsChart';
import DensityDateRangePicker from 'dashboard/components/DensityDateRangePicker';
import {totalVisitsSetDateRange, totalVisitsFetch} from 'dashboard/actions/total-visitors';

function TotalVisits({
  spaceId,
  onSetDateRange,
  startDate,
  endDate,
  totalVisitorCounts,
  dates
}) {
  return (
    <div className="total-visitors-section">
      <div className="card-top-header">
        <span className="title">Total Visits</span>
      </div>
      <div className="date-picker">
        <span className="date-picker-text">Date Range:</span>
        <DensityDateRangePicker startDate={startDate} endDate={endDate} onChange={onSetDateRange} />
      </div>
      <TotalVisitsChart dates={dates} totalVisitorCounts={totalVisitorCounts} />
    </div>
  )
}

const mapStateToProps = state => ({
  startDate: state.totalVisits.startDate,
  endDate: state.totalVisits.endDate,
  totalVisitorCounts: state.totalVisits.totalVisitorCounts,
  dates: state.totalVisits.dates
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSetDateRange: (value) => {
    dispatch(totalVisitsSetDateRange(value));
    dispatch(totalVisitsFetch(ownProps.spaceId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TotalVisits);