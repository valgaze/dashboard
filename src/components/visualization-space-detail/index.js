import * as React from 'react';
import { connect } from 'react-redux';
import { core } from '@density-int/client';

import { isInclusivelyBeforeDay } from '@density/react-dates';
import DatePicker, { ANCHOR_RIGHT } from '@density/ui-date-picker';

import moment from 'moment';
import 'moment-timezone';

import Card, { CardHeader, CardBody } from '@density/ui-card';

import historicalCounts from '@density/chart-historical-counts';
import { chartAsReactComponent } from '@density/charts';
const HistoricalCountsComponent = chartAsReactComponent(historicalCounts);

const LOADING = 'LOADING',
      EMPTY = 'EMPTY',
      VISIBLE = 'VISIBLE',
      ERROR = 'ERROR';

console.log('picker', DatePicker)
class TwentyFourHourChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: LOADING,
      data: null,
      dataSpaceId: null,
      datePickerOpen: false,
      hoursOffsetFromUtc: 0,
      date: moment.utc().format(),
    };
  }
  fetchData() {
    const {space} = this.props;
    const hoursOffsetFromUtc = parseInt(moment.tz(space.timeZone).format('Z').split(':')[0], 10);
    const startTime = moment.utc(this.state.date).startOf('day').subtract(hoursOffsetFromUtc, 'hours');
    const endTime = startTime.clone().add(24, 'hours');

    return core.spaces.counts({
      id: space.id,
      start_time: startTime.format(),
      end_time: endTime.format(),
      interval: '5m',
      page_size: 1000,
    }).then(data => {
      if (data.results.length > 0) {
        this.setState({
          state: VISIBLE,
          dataSpaceId: space.id,
          hoursOffsetFromUtc,
          data,
        });
      } else {
        this.setState({
          state: EMPTY,
          dataSpaceId: space.id,
          hoursOffsetFromUtc,
        });
      }
    }).catch(error => {
      this.setState({
        state: ERROR,
        error,
        dataSpaceId: space.id,
        hoursOffsetFromUtc,
      });
    });
  }
  render() {
    const {space} = this.props;
    if (space && space.id !== this.state.dataSpaceId) {
      this.fetchData.call(this);
    }

    const min = this.state.data ? Math.min.apply(Math, this.state.data.results.map(i => i.count)) : '-';
    const max = this.state.data ? Math.max.apply(Math, this.state.data.results.map(i => i.count)) : '-';

    if (space) {
      return <Card className="visualization-space-detail-card">
        <CardHeader className="visualization-space-detail-24-hour-card-header">
          <span className="visualization-space-detail-24-hour-card-header-label">24 Hour Chart</span>
          <div className="visualization-space-detail-24-hour-card-date-picker">
            <DatePicker
              date={moment.utc(this.state.date).add(this.state.hoursOffsetFromUtc, 'hours')}
              onChange={date => {
                this.setState({
                  state: LOADING,
                  data: null,
                  date: date.format(),
                }, () => this.fetchData());
              }}
              focused={this.state.datePickerOpen}
              onFocusChange={({focused}) => this.setState({datePickerOpen: focused})}
              anchor={ANCHOR_RIGHT}

              isOutsideRange={day => !isInclusivelyBeforeDay(day, moment.utc())}
            />
          </div>
        </CardHeader>

        <div className="visualization-space-detail-well">
          <div className="visualization-space-detail-well-section">
            <span className="visualization-space-detail-well-section-quantity">{space.capacity}</span>
            <span className="visualization-space-detail-well-section-label">Capacity</span>
          </div>
          <div className="visualization-space-detail-well-section">
            <span className="visualization-space-detail-well-section-quantity">{min}</span>
            <span className="visualization-space-detail-well-section-label">Minimum</span>
          </div>
          <div className="visualization-space-detail-well-section">
            <span className="visualization-space-detail-well-section-quantity">{max}</span>
            <span className="visualization-space-detail-well-section-label">Maximum</span>
          </div>
        </div>

        <CardBody className="visualization-space-detail-24-hour-card-body">
          {this.state.state === VISIBLE ? <HistoricalCountsComponent
            width={930}
            data={this.state.data.results}
            capacity={space.capacity}
            timeZoneLabel="ET"
            timeZoneOffset={this.state.hoursOffsetFromUtc}
          /> : null}
        </CardBody>
      </Card>;
    } else {
      return <span>This space doesn't exist.</span>;
    }
  }
}

export function SpaceDetail({space}) {
  if (space) {
    return <div className="visualization-space-detail">

      {/* 24 hour chart card */}
      <TwentyFourHourChart space={space} />

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
