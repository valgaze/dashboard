import React from 'react';
import {connect} from 'react-redux';

import TotalVisitorsChart from 'dashboard/components/TotalVisitorsChart';
import DensityDateRangePicker from 'dashboard/components/DensityDateRangePicker';
import {totalVisitorsSetDateRange, totalVisitorsFetch} from 'dashboard/actions/total-visitors';

function TotalVisitors({
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
        <span className="title">Total Visitors</span>
      </div>
      <div className="date-range">
        <span className="date-range-text">Date Range:</span>
        <DensityDateRangePicker startDate={startDate} endDate={endDate} onChange={onSetDateRange} />
      </div>
      <TotalVisitorsChart dates={dates} totalVisitorCounts={totalVisitorCounts} />
    </div>
  )
}

const mapStateToProps = state => ({
  startDate: state.totalVisitors.startDate,
  endDate: state.totalVisitors.endDate,
  totalVisitorCounts: state.totalVisitors.totalVisitorCounts,
  dates: state.totalVisitors.dates
});

const mapDispatchToProps = dispatch => ({
  onSetDateRange: (value) => {
    dispatch(totalVisitorsSetDateRange(value));
    dispatch(totalVisitorsFetch());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TotalVisitors);