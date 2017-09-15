import * as React from 'react';
import { connect } from 'react-redux';

import TwentyFourHourCard from '../visualization-space-detail-24-hour-chart/index';
import DailyMetricsCard from '../visualization-space-detail-daily-metrics-card/index';
import RawEventsCard from '../visualization-space-detail-raw-events-card/index';

export function SpaceDetail({space}) {
  if (space) {
    return <div className="visualization-space-detail">
      {/* 24 hour chart card */}
      <TwentyFourHourCard space={space} />

      {/* Daily Metrics chart card */}
      <DailyMetricsCard space={space} />

      {/* Raw Events chart card */}
      <RawEventsCard space={space} />
    </div>;
  } else {
    return <span>This space doesn't exist.</span>;
  }
}

export default connect(state => {
  return {
    space: state.spaces.data.find(space => space.id === state.spaces.selected),
  };
}, dispatch => {
  return {};
})(SpaceDetail);
