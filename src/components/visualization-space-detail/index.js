import * as React from 'react';
import { connect } from 'react-redux';

import RealTimeBar from '../visualization-space-detail-real-time-bar/index';
import TwentyFourHourCard from '../visualization-space-detail-24-hour-chart/index';
import DailyMetricsCard from '../visualization-space-detail-daily-metrics-card/index';
import RawEventsCard from '../visualization-space-detail-raw-events-card/index';

export function SpaceDetail({
  space,
  spacesLoading,
  spacesError,

  activeModal,
  onOpenModal,
  onCloseModal,
}) {
  if (space) {
    return <div className="visualization-space-detail">
      {/* Real time bar */}
      <RealTimeBar space={space} />

      <div className="visualization-space-detail-container">
        {/* Page header */}
        <div className="visualization-space-detail-header">
          <h1 className="visualization-space-detail-header-container">
            <a href="#/insights/spaces" className="visualization-space-detail-header-back-section">Spaces</a>
            <span className="visualization-space-detail-header-title">{space.name}</span>
          </h1>
          <div className="visualization-space-detail-header-tag">Historical</div>

          {/* Attempt to display a nicer representation of the time zone, but fall back on the time zone name */}
          <div className="visualization-space-detail-header-time-zone">{({
            'America/New_York': 'Eastern',
            'America/Chicago': 'Central',
            'America/Denver': 'Mountain',
            'America/Los_Angeles': 'Pacific',
          })[space.timeZone] || space.timeZone}</div>
        </div>

        {/* 24 hour chart card */}
        <TwentyFourHourCard space={space} />

        {/* Daily Metrics chart card */}
        <DailyMetricsCard space={space} />

        {/* Raw Events chart card */}
        <RawEventsCard space={space} />
      </div>
    </div>;
  } else if (spacesLoading) {
    return <div className="visualization-space-detail-loading">Loading Space...</div>;
  } else if (!space && !spacesLoading) {
    return <div className="visualization-space-detail-loading">This space doesn't exist.</div>;
  } else {
    return <div className="visualization-space-detail-loading">{spacesError}</div>;
  }
}

export default connect(state => {
  return {
    space: state.spaces.data.find(space => space.id === state.spaces.selected),
    spacesLoading: state.spaces.loading,
    spacesError: state.spaces.error,
  };
}, dispatch => {
  return {};
})(SpaceDetail);
