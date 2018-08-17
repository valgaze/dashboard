import React from 'react';
import classnames from 'classnames';

import moment from 'moment';
import 'moment-timezone';

import { core } from '../../client';
import Card, { CardHeader, CardBody, CardLoading } from '@density/ui-card';
import { IconRefresh } from '@density/ui-icons';

import { isWithinTimeSegment, TIME_SEGMENTS } from '../../helpers/space-utilization/index';

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
  state = {
    view: LOADING,
    data: null,
    dataSpaceId: null,
    datePickerOpen: false,
    date: moment.utc().format(),
  }

  fetchData = () => {
    const { space } = this.props;
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
          view: VISIBLE,
          dataSpaceId: space.id,
          data: [
            data.results[0],
            ...data.results.filter(datum => {
              return isWithinTimeSegment(
                datum.timestamp,
                space.timeZone,
                TIME_SEGMENTS[this.state.timeSegmentId],
              );
            }),
          ],
        });
      } else {
        this.setState({
          view: EMPTY,
          dataSpaceId: space.id,
        });
      }
    }).catch(error => {
      this.setState({
        view: ERROR,
        error,
        dataSpaceId: space.id,
      });
    });
  }

  componentWillReceiveProps({space, date, timeSegmentId}) {
    if (space && (
      space.id !== this.state.dataSpaceId ||
      date !== this.state.date ||
      timeSegmentId !== this.state.timeSegmentId
    )) {
      this.setState({
        view: LOADING,
        date,
        timeSegmentId,
      }, () => this.fetchData());
    }
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  render() {
    const { space } = this.props;
    const {
      view,
      data,
      error,

      date,
      timeSegmentId,
    } = this.state;

    const min = data ? Math.min.apply(Math, data.map(i => i.count)) : '-';
    const max = data ? Math.max.apply(Math, data.map(i => i.count)) : '-';

    const timeSegment = TIME_SEGMENTS[timeSegmentId] || {start: 0, end: 24};
    const startOfDayTime = moment.utc(date).tz(space.timeZone).startOf('day');
    const startTime = startOfDayTime.clone().add(timeSegment.start, 'hours');
    const endTime = startOfDayTime.clone().add(timeSegment.end, 'hours');

    if (space) {
      const largestCount = view === 'VISIBLE' ? (
        data.reduce((acc, i) => i.count > acc.count ? i : acc, {count: -1})
      ) : null;

      return <Card className="insights-space-detail-card">
        { view === LOADING ? <CardLoading indeterminate /> : null }
        <CardHeader className="insights-space-detail-foot-traffic-card-header">
          <span className="insights-space-detail-foot-traffic-card-header-label">
            Foot Traffic
          </span>
          <span
            className={classnames('insights-space-detail-foot-traffic-card-header-refresh', {
              disabled: view !== VISIBLE,
            })}
            onClick={() => this.setState({
              view: LOADING,
              data: null,
            }, () => this.fetchData())}
          >
            <IconRefresh color={view === LOADING ? 'gray' : 'primary'} />
          </span>
        </CardHeader>

        <div className="insights-space-detail-well">
          <div className="insights-space-detail-well-section capacity">
            <span className="insights-space-detail-well-section-quantity">{space.capacity || '-'}</span>
            <span className="insights-space-detail-well-section-label">Capacity</span>
          </div>
          <div className="insights-space-detail-well-section minimum">
            <span className="insights-space-detail-well-section-quantity">{min}</span>
            <span className="insights-space-detail-well-section-label">Minimum</span>
          </div>
          <div className="insights-space-detail-well-section maximum">
            <span className="insights-space-detail-well-section-quantity">{max}</span>
            <span className="insights-space-detail-well-section-label">Maximum</span>
          </div>
        </div>

        <CardBody className="insights-space-detail-foot-traffic-card-body">
          {view === VISIBLE ? <LineChartComponent
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
                data: data.map(i => ({
                    timestamp: i.timestamp,
                    value: i.interval.analytics.max,
                  })).sort((a, b) =>
                    moment.utc(a.timestamp).valueOf() - moment.utc(b.timestamp).valueOf()
                  ),
              },
            ]}
          /> : null}

          {view === LOADING ? <div className="insights-space-detail-foot-traffic-card-body-info">
            <span>Generating Data&nbsp;.&nbsp;.&nbsp;.</span>
          </div> : null}
          {view === EMPTY ? <div className="insights-space-detail-foot-traffic-card-body-info">
            <span>No data found in date range.</span>
          </div> : null}
          {view === ERROR ? <div className="insights-space-detail-foot-traffic-card-body-info">
            <span>
              <span className="insights-space-detail-foot-traffic-card-body-error-icon">&#xe91a;</span>
              {error.toString()}
            </span>
          </div> : null}
          </CardBody>
      </Card>;
    } else {
      return <span>This space doesn't exist.</span>;
    }
  }
}
