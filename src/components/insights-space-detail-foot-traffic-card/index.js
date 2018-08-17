import * as React from 'react';

import moment from 'moment';
import 'moment-timezone';

import { core } from '../../client';
import Card, { CardHeader, CardBody, CardLoading } from '@density/ui-card';
import { isInclusivelyBeforeDay } from '@density/react-dates';
import DatePicker, { ANCHOR_RIGHT } from '@density/ui-date-picker';

import lineChart, { dataWaterline } from '@density/chart-line-chart';
import { xAxisDailyTick, yAxisMinMax } from '@density/chart-line-chart/dist/axes';
import {
  overlayTwoPopups,
  overlayTwoPopupsPersonIconTextFormatter,
  overlayTwoPopupsPlainTextFormatter,
} from '@density/chart-line-chart/dist/overlays';
import { chartAsReactComponent } from '@density/charts';
const LineChartComponent = chartAsReactComponent(lineChart);

const ONE_MINUTE_IN_MS = 60 * 1000, ONE_HOUR_IN_MS = ONE_MINUTE_IN_MS * 60;

const LOADING = 'LOADING',
      EMPTY = 'EMPTY',
      VISIBLE = 'VISIBLE',
      ERROR = 'ERROR';

export default class InsightsSpaceDetailFootTrafficCard extends React.Component {
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
      order: 'desc',
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

    const startTime = moment.utc(this.state.date).tz(space.timeZone).startOf('day');
    const endTime = startTime.clone().add(1, 'day');

    if (space) {
      const largestCount = this.state.state === 'VISIBLE' ? this.state.data.results.reduce((acc, i) => i.count > acc.count ? i : acc, {count: -1}) : null;

      return <Card className="visualization-space-detail-card">
        { this.state.state === LOADING ? <CardLoading indeterminate /> : null }
        <CardHeader className="visualization-space-detail-24-hour-card-header">
          <span className="visualization-space-detail-24-hour-card-header-label">
            24 Hour Chart
            <span
              className="visualization-space-detail-24-hour-card-header-refresh"
              onClick={() => this.setState({
                state: LOADING,
                data: null,
              }, () => this.fetchData.call(this))}
            />
          </span>
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
          {this.state.state === VISIBLE ? <LineChartComponent
            timeZone={space.timeZone}
            svgWidth={975}
            svgHeight={350}

            xAxisStart={startTime}
            xAxisEnd={endTime}
            xAxis={xAxisDailyTick({
              timeBetweenTicksInMs: 1 * ONE_HOUR_IN_MS,
              bottomOffset: 20,
              formatter: (n) => {
                // "5a" or "8p"
                const timeFormat = moment.utc(n).tz(space.timeZone).format('hA');
                return timeFormat.slice(0, timeFormat.startsWith('12') ? -1 : -2).toLowerCase();
              },
            })}

            yAxis={yAxisMinMax({
              leftOffset: 20,
              points: [
                ...(space.capacity !== null ? [{value: space.capacity, hasShadow: true}] : []),
                {value: largestCount.count, hasRule: false, hasShadow: false},
              ],
              showMaximumPoint: false,
            })}
            yAxisEnd={space.capacity !== null ?  Math.max(space.capacity, largestCount.count) : undefined}

            overlays={[
              overlayTwoPopups({
                topPopupFormatter: overlayTwoPopupsPersonIconTextFormatter(item => `${item.value}`),
                bottomPopupFormatter: overlayTwoPopupsPlainTextFormatter(
                  (item, {mouseX, xScale}) => {
                    const timestamp = moment.utc(xScale.invert(mouseX)).tz(space.timeZone);
                    const time = timestamp.format(`h:mma`).slice(0, -1);
                    const date = timestamp.format(`ddd MMM Do`);
                    return `${time} ${date}`;
                  }
                ),

                bottomOverlayTopMargin: 40,
                topOverlayBottomMargin: 20,

                topOverlayWidth: 80,
                topOverlayHeight: 42,
                bottomOverlayWidth: 200,
                bottomOverlayHeight: 42,
              }),
            ]}

            data={[
              {
                name: 'default',
                type: dataWaterline,
                verticalBaselineOffset: 10,
                data: this.state.data.results.map(i => ({
                    timestamp: i.timestamp,
                    value: i.interval.analytics.max,
                  })).sort((a, b) =>
                    moment.utc(a.timestamp).valueOf() - moment.utc(b.timestamp).valueOf()
                  ),
              },
            ]}
          /> : null}

          {this.state.state === LOADING ? <div className="visualization-space-detail-24-hour-card-body-info">
            <span>Generating Data&nbsp;.&nbsp;.&nbsp;.</span>
          </div> : null}
          {this.state.state === EMPTY ? <div className="visualization-space-detail-24-hour-card-body-info">
            <span>No data found in date range.</span>
          </div> : null}
          {this.state.state === ERROR ? <div className="visualization-space-detail-24-hour-card-body-info">
            <span>
              <span className="visualization-space-detail-24-hour-card-body-error-icon">&#xe91a;</span>
              {this.state.error}
            </span>
          </div> : null}
          </CardBody>
      </Card>;
    } else {
      return <span>This space doesn't exist.</span>;
    }
  }
}
