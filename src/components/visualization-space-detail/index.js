import * as React from 'react';
import { connect } from 'react-redux';
import { core } from '@density-int/client';

import moment from 'moment';
import 'moment-timezone';

import Card, { CardHeader, CardBody } from '@density/ui-card';

import historicalCounts from '@density/chart-historical-counts';
import { chartAsReactComponent } from '@density/charts';
const HistoricalCountsComponent = chartAsReactComponent(historicalCounts);

const LOADING = 'LOADING',
      EMPTY = 'EMPTY',
      VISIBLE = 'VISIBLE';

export class SpaceDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = { state: LOADING, data: null };
  }
  componentWillMount() {
    const {initialSpace} = this.props;
    const hoursOffsetFromUtc = parseInt(moment.tz(initialSpace.timeZone).format('Z').split(':')[0], 10);
    const startTime = moment.utc().startOf('day').add(hoursOffsetFromUtc, 'hours');
    const endTime = startTime.clone().add(24, 'hours');

    return core.spaces.counts({
      id: initialSpace.id,
      start_time: startTime.format(),
      end_time: endTime.format(),
      interval: '1m',
    }).then(data => {
      if (data.results.length > 0) {
        this.setState({
          state: VISIBLE,
          data,
        });
      } else {
        this.setState({state: EMPTY});
      }
    }).catch(err => {
      console.error('error', err);
    });
  }
  render() {
    const {initialSpace} = this.props;
    if (initialSpace) {
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
            {this.state.state === VISIBLE ? <HistoricalCountsComponent
              width={900}
              data={this.state.data.results}
              capacity={initialSpace.capacity}
            /> : null}
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
}

export default connect(state => {
  return {
    initialSpace: state.spaces.data.find(space => space.id === state.spaces.selected),
  };
}, dispatch => {
  return {};
})(function SpaceDetailWrapper(props) {
  if (props.initialSpace) {
    return <SpaceDetail {...props} />;
  } else {
    return <p>Loading...</p>;
  }
});
