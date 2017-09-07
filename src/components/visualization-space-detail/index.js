import * as React from 'react';
import { connect } from 'react-redux';

import Card, { CardHeader, CardBody } from '@density/ui-card';

export function SpaceDetail({space}) {
  if (space) {
    return <div className="visualization-space-detail">

      {/* 24 hour chart card */}
      <Card className="visualization-space-detail-card">
        <CardHeader>24 Hour Chart</CardHeader>

        <div className="visualization-space-detail-well">
          <div className="visualization-space-detail-well-section">
            <span className="visualization-space-detail-well-section-quantity">0</span>
            <span className="visualization-space-detail-well-section-label">Minimum</span>
          </div>
          <div className="visualization-space-detail-well-section">
            <span className="visualization-space-detail-well-section-quantity">0</span>
            <span className="visualization-space-detail-well-section-label">Maximum</span>
          </div>
        </div>

        <CardBody>
          lorem ipsum
        </CardBody>
      </Card>

      {/* Total visits chart */}
      <Card className="visualization-space-detail-card">
        <CardHeader>Total Visits</CardHeader>
        <CardBody>
          lorem ipsum
        </CardBody>
      </Card>

      {/* Raw Events chart */}
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
