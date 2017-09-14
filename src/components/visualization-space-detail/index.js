import * as React from 'react';
import { connect } from 'react-redux';

import Card, { CardHeader, CardBody } from '@density/ui-card';

import TwentyFourHourCard from '../visualization-space-detail-24-hour-chart/index';
import DailyMetricsCard from '../visualization-space-detail-daily-metrics-card/index';

export function SpaceDetail({space}) {
  if (space) {
    return <div className="visualization-space-detail">
      {/* 24 hour chart card */}
      <TwentyFourHourCard space={space} />

      {/* Daily Metrics chart card */}
      <DailyMetricsCard space={space} />

      {/* Raw Events chart card */}
      <Card className="visualization-space-detail-card">
        <CardHeader>Raw Events</CardHeader>
        <CardBody className="visualization-space-detail-card-table-row header">
          <li>Timestamp</li>
          <li>Event</li>
          <li>Doorway</li>
          <li>Count</li>
        </CardBody>
        <CardBody className="visualization-space-detail-card-table-row">
          <li>Sep 5, 2017 @ 12:00:00</li>
          <li>Ingress</li>
          <li>My doorway</li>
          <li>123</li>
        </CardBody>
        <CardBody className="visualization-space-detail-card-table-row">
          <li>Sep 5, 2017 @ 12:00:00</li>
          <li>Ingress</li>
          <li>My doorway</li>
          <li>123</li>
        </CardBody>
      </Card>
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
