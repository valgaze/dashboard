import * as React from 'react';

import moment from 'moment';
import 'moment-timezone';

import { core } from '@density-int/client';
import Card, { CardHeader, CardBody, CardLoading } from '@density/ui-card';
import { isInclusivelyBeforeDay } from '@density/react-dates';
import DatePicker, { ANCHOR_RIGHT } from '@density/ui-date-picker';
import getTimeZoneGeneralizedShortName from '../../helpers/get-time-zone-generalized-short-name/index';

import historicalCounts from '@density/chart-historical-counts';
import { chartAsReactComponent } from '@density/charts';
const HistoricalCountsComponent = chartAsReactComponent(historicalCounts);

const LOADING = 'LOADING',
      EMPTY = 'EMPTY',
      VISIBLE = 'VISIBLE',
      ERROR = 'ERROR';

export default class VisualizationSpaceDetail24HourChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: LOADING,
      data: null,
      dataSpaceId: null,
      datePickerOpen: false,
      date: moment.utc().format(),
    };
  }
  fetchData() {
    const {space} = this.props;
    const startTime = moment.utc(this.state.date).tz(space.timeZone).startOf('day');
    const endTime = startTime.clone().add(1, 'day');

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
          data,
        });
      } else {
        this.setState({
          state: EMPTY,
          dataSpaceId: space.id,
        });
      }
    }).catch(error => {
      this.setState({
        state: ERROR,
        error,
        dataSpaceId: space.id,
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
        { this.state.state === LOADING ? <CardLoading indeterminate /> : null }
        <CardHeader className="visualization-space-detail-24-hour-card-header">
          <span className="visualization-space-detail-24-hour-card-header-label">24 Hour Chart</span>
          <div className="visualization-space-detail-24-hour-card-date-picker">
            <DatePicker
              date={moment.utc(this.state.date).tz(space.timeZone).startOf('day').tz('UTC')}
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

              isOutsideRange={day => !isInclusivelyBeforeDay(day, moment.utc().tz(space.timeZone).startOf('day').tz('UTC'))}
            />
          </div>
        </CardHeader>

        <div className="visualization-space-detail-well">
          <div className="visualization-space-detail-well-section capacity">
            <span className="visualization-space-detail-well-section-quantity">{space.capacity || '-'}</span>
            <span className="visualization-space-detail-well-section-label">Capacity</span>
          </div>
          <div className="visualization-space-detail-well-section minimum">
            <span className="visualization-space-detail-well-section-quantity">{min}</span>
            <span className="visualization-space-detail-well-section-label">Minimum</span>
          </div>
          <div className="visualization-space-detail-well-section maximum">
            <span className="visualization-space-detail-well-section-quantity">{max}</span>
            <span className="visualization-space-detail-well-section-label">Maximum</span>
          </div>
        </div>

        <CardBody className="visualization-space-detail-24-hour-card-body">
          {this.state.state === VISIBLE ? <HistoricalCountsComponent
            width={930}
            data={this.state.data.results}
            capacity={space.capacity}
            timeZoneLabel={getTimeZoneGeneralizedShortName(space.timeZone)}
            timeZoneOffset={-1 * (moment.tz.zone(space.timeZone).offset(moment.utc(this.state.date)) / 60)}
          /> : <div className="visualization-space-detail-24-hour-card-body-placeholder" />}
        </CardBody>
      </Card>;
    } else {
      return <span>This space doesn't exist.</span>;
    }
  }
}
