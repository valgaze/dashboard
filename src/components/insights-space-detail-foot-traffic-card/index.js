import React from 'react';
import classnames from 'classnames';

import moment from 'moment';
import 'moment-timezone';

import { core } from '../../client';
import CardDataModule from '@density/ui-card-data-module';
import { IconRefresh } from '@density/ui-icons';
import InfoPopup from '@density/ui-info-popup';

import {
  DEFAULT_TIME_SEGMENT,
  DEFAULT_TIME_SEGMENT_GROUP,
  parseTimeInTimeSegmentToSeconds,
} from '../../helpers/time-segments/index';

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

    timeSegmentGroup: DEFAULT_TIME_SEGMENT_GROUP,
    timeSegment: DEFAULT_TIME_SEGMENT,
  }

  fetchData = () => {
    const { space } = this.props;
    const { timeSegmentGroup } = this.state;
    const day = moment.utc(this.state.date).tz(space.timeZone);

    return core.spaces.counts({
      id: space.id,
      start_time: day.startOf('day').format(),
      end_time: day.endOf('day').format(),
      time_segment_groups: timeSegmentGroup.id === DEFAULT_TIME_SEGMENT_GROUP.id ? '' : timeSegmentGroup.id,
      interval: '5m',
      page: 1,
      page_size: 1000,
      order: 'desc',
    }).then(data => {
      if (data.results.length > 0) {
        this.setState({
          view: VISIBLE,
          dataSpaceId: space.id,
          data: data.results,
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

  componentWillReceiveProps({space, date, timeSegment, timeSegmentGroup}) {
    if (space && (
      space.id !== this.state.dataSpaceId ||
      date !== this.state.date ||
      timeSegment.id !== this.state.timeSegment.id ||
      timeSegmentGroup.Id !== this.state.timeSegmentGroup.Id
    )) {
      this.setState({
        view: LOADING,
        date,
        timeSegment,
        timeSegmentGroup,
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
      timeSegment,
      timeSegmentGroup,
    } = this.state;

    const chartData = data ? data.map(i => ({
        timestamp: i.timestamp,
        value: i.interval.analytics.max,
    })).sort((a, b) => {
      if (b) {
        return moment.utc(a.timestamp).valueOf() - moment.utc(b.timestamp).valueOf();
      } else {
        return 0;
      }
    }) : null;

    const min = data ? Math.min.apply(Math, data.map(i => i.count)) : '-';
    const max = data ? Math.max.apply(Math, data.map(i => i.count)) : '-';

    const startOfDayTime = moment.utc(date).tz(space.timeZone).startOf('day');
    const startTime = startOfDayTime
      .clone()
      .add(parseTimeInTimeSegmentToSeconds(timeSegment.start), 'seconds');
    const endTime = startOfDayTime
      .clone()
      .add(parseTimeInTimeSegmentToSeconds(timeSegment.end), 'seconds');

    if (space) {
      const largestCount = view === 'VISIBLE' ? (
        data.reduce((acc, i) => i.count > acc.count ? i : acc, {count: -1})
      ) : null;

      return <CardDataModule
        loading={view === LOADING}
        height={585}
        title={<span>
          Foot Traffic
          <InfoPopup horizontalIconOffset={8}>
            <p className="insights-space-detail-foot-traffic-card-popup-p">
              Count over time for <strong>{timeSegmentGroup.name}</strong> over
              the time period of{' '}
              <strong>{moment.utc(date).tz(space.timeZone).format('MM/DD/YYYY')}</strong>, queried
              in 5 minute intervals.
            </p>

            <p className="insights-space-detail-foot-traffic-card-popup-p">
              Use this chart to understand visitation over the course of a day.
            </p>
          </InfoPopup>
        </span>}
        error={view === ERROR && error.toString()}
        refreshDisabled={view !== VISIBLE}
        onRefresh={() => this.setState({
          view: LOADING,
          data: null,
        }, () => this.fetchData())}
      >
        <div className="insights-space-detail-foot-traffic-card-well">
          <div className="insights-space-detail-foot-traffic-card-well-section capacity">
            <span className="insights-space-detail-foot-traffic-card-well-section-quantity">{space.capacity || '-'}</span>
            <span className="insights-space-detail-foot-traffic-card-well-section-label">Capacity</span>
          </div>
          <div className="insights-space-detail-foot-traffic-card-well-section minimum">
            <span className="insights-space-detail-foot-traffic-card-well-section-quantity">{min}</span>
            <span className="insights-space-detail-foot-traffic-card-well-section-label">Minimum</span>
          </div>
          <div className="insights-space-detail-foot-traffic-card-well-section maximum">
            <span className="insights-space-detail-foot-traffic-card-well-section-quantity">{max}</span>
            <span className="insights-space-detail-foot-traffic-card-well-section-label">Maximum</span>
          </div>
        </div>

        <div className="insights-space-detail-foot-traffic-card-body">
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

            yAxisStart={0}
            yAxisEnd={space.capacity !== null ?  Math.max(space.capacity, largestCount.count) : undefined}
            yAxis={yAxisMinMax({
              leftOffset: 20,
              points: [
                ...(space.capacity !== null ? [{value: space.capacity, hasShadow: true}] : []),
                {value: largestCount.count, hasRule: false, hasShadow: false},
              ],
              showMaximumPoint: false,
            })}

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
                // BUG: chart can't render a single datapoint.
                data: chartData.length === 1 ? [...chartData, ...chartData] : chartData,
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
        </div>
      </CardDataModule>;
    } else {
      return <span>This space doesn't exist.</span>;
    }
  }
}
