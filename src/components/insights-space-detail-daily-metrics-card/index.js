import React from 'react';
import classnames from 'classnames';

import moment from 'moment';
import 'moment-timezone';

import { core } from '../../client';
import Card, { CardHeader, CardBody, CardLoading } from '@density/ui-card';
import { isInclusivelyBeforeDay, isInclusivelyAfterDay } from '@density/react-dates';
import InputBox from '@density/ui-input-box';
import { IconRefresh } from '@density/ui-icons';
import InfoPopup from '@density/ui-info-popup';

import { TIME_SEGMENTS } from '../../helpers/space-utilization/index';

import dailyMetrics from '@density/chart-daily-metrics';
import lineChart, { dataWaterline } from '@density/chart-line-chart';
import { xAxisDailyTick, yAxisMinMax } from '@density/chart-line-chart/dist/axes';
import {
  overlayTwoPopups,
  overlayTwoPopupsPlainTextFormatter,
} from '@density/chart-line-chart/dist/overlays';

import { chartAsReactComponent } from '@density/charts';
const DailyMetricsComponent = chartAsReactComponent(dailyMetrics);
const LineChartComponent = chartAsReactComponent(lineChart);

const ONE_MINUTE_IN_MS = 60 * 1000,
      ONE_HOUR_IN_MS = ONE_MINUTE_IN_MS * 60,
      ONE_DAY_IN_MS = ONE_HOUR_IN_MS * 60;

const LOADING = 'LOADING',
      EMPTY = 'EMPTY',
      VISIBLE = 'VISIBLE',
      ERROR = 'ERROR';

// The maximum number of days that can be selected by the date range picker
const MAXIMUM_DAY_LENGTH = 3 * 31; // Three months of data

// Below this number of days or equal to this number of days, show the normal daily metrics chart.
// Above this number of days, show the expanded line chart.
const GRAPH_TYPE_TRANSITION_POINT_IN_DAYS = 14;

// Given a day on the calendar and the current day, determine if the square on the calendar should
// be grayed out or not.
export function isOutsideRange(startISOTime, datePickerInput, day) {
  const startDate = moment.utc(startISOTime);
  if (day.isAfter(moment.utc())) {
    return true;
  }

  if (datePickerInput === 'endDate') {
    return datePickerInput === 'endDate' && startDate &&
      !( // Is the given `day` within `MAXIMUM_DAY_LENGTH` days from the start date?
        isInclusivelyAfterDay(day, startDate) &&
        isInclusivelyBeforeDay(day, startDate.clone().add(MAXIMUM_DAY_LENGTH - 1, 'days'))
      );
  }
  return false;
}

export default class InsightsSpaceDetailDailyMetricsCard extends React.Component {
  state = {
    view: LOADING,
    data: null,
    dataSpaceId: null,

    datePickerInput: null,
    hoursOffsetFromUtc: 0,
    metricToDisplay: 'entrances',

    startDate: null,
    endDate: null,
  }

  fetchData = async () => {
    const { space } = this.props;
    const { metricToDisplay, startDate, endDate } = this.state;

    // Add timezone offset to both start and end times prior to querying for the count.
    const hoursOffsetFromUtc = parseInt(moment.tz(space.timeZone).format('Z').split(':')[0], 10);
    const startTime = moment.utc(startDate).tz(space.timeZone).startOf('day');
    const endTime = moment.utc(endDate).tz(space.timeZone).startOf('day');

    // Fetch data from the server for the day-long window.
    try {
      const data = await core.spaces.counts({
        id: space.id,
        start_time: startTime.format(),
        // Add a day to the end of the range to return a final bar of the data for the uncompleted
        // current day.
        end_time: endTime.add(1, 'day').format(),
        interval: '1d',
        order: 'asc',

        page_size: 1000,
      });

      if (data.results.length > 0) {
        this.setState({
          view: VISIBLE,
          dataSpaceId: space.id,
          hoursOffsetFromUtc,
          // Return the metric requested within the range of time.
          data: data.results.map(i => ({
            timestamp: i.timestamp,
            value: (function(i, metric) {
              switch (metric) {
              case 'entrances':
                return i.interval.analytics.entrances;
              case 'exits':
                return i.interval.analytics.exits;
              case 'total-events':
                return i.interval.analytics.events;
              case 'peak-occupancy':
                return i.interval.analytics.max;
              default:
                return false
              }
            })(i, metricToDisplay) || 0,
          })),
        });
      } else {
        this.setState({
          view: EMPTY,
          dataSpaceId: space.id,
          hoursOffsetFromUtc,
        });
      }
    } catch (error) {
      this.setState({
        view: ERROR,
        error,
        dataSpaceId: space.id,
        hoursOffsetFromUtc,
      });
    }
  }

  // When a new start date and end data is received, attempt to refetch data.
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.startDate && nextProps.endDate && (
        nextProps.startDate !== this.state.startDate ||
        nextProps.endDate !== this.state.endDate
      )
    ) {
      this.setState({
        view: LOADING,
        data: null,
        startDate: nextProps.startDate,
        endDate: nextProps.endDate,
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
      error,
      metricToDisplay,
      data,
      startDate,
      endDate,
      timeSegmentId,
    } = this.state;

    if (space) {
      return (
        <Card>
          {view === LOADING ? <CardLoading indeterminate /> : null }

          <CardHeader>
            <div className="insights-space-detail-daily-metrics-card-header-container">
              <span className="insights-space-detail-daily-metrics-card-header-label">
                Daily Metrics
                <InfoPopup>
                  Visitation metrics for {timeSegmentId ?
                  TIME_SEGMENTS[timeSegmentId].phrasal : null}, grouped by day over {' '}
                  {moment.utc(startDate).tz(space.timeZone).format('MM/DD/YYYY')} -{' '}
                  {moment.utc(endDate).tz(space.timeZone).format('MM/DD/YYYY')}.

                  Use these metrics to understand the visitation of your space, and how it trends
                  over time.

                  <ul className="insights-space-detail-daily-metrics-card-popup-ul">
                    <li>
                      <strong>Entrances</strong>: Total number of events from people entering the space.
                    </li>
                    <li>
                      <strong>Exits</strong>: Total number of events from people exiting the space.
                    </li>
                    <li>
                      <strong>Peak Counts</strong>: Peak count at any given point in time over the course of the day.
                    </li>
                  </ul>
                </InfoPopup>
              </span>
              <div className="insights-space-detail-daily-metrics-card-header-controls">
                <span
                  className={classnames('insights-space-detail-daily-metrics-card-refresh', {
                    disabled: view !== VISIBLE,
                  })}
                  onClick={() => this.setState({
                    view: LOADING,
                    data: null,
                  }, () => this.fetchData())}
                >
                  <IconRefresh color={view === LOADING ? 'gray' : 'primary'} />
                </span>
                <div className="insights-space-detail-daily-metrics-card-metric-picker">
                  <InputBox
                    type="select"
                    value={metricToDisplay}
                    disabled={view !== VISIBLE}
                    onChange={e => {
                      this.setState({
                        view: LOADING,
                        data: null,
                        metricToDisplay: e.id,
                      }, () => this.fetchData());
                    }}
                    choices={[
                      {id: "entrances", label: "Entrances"},
                      {id: "exits", label: "Exits"},
                      {id: "total-events", label: "Total Events"},
                      {id: "peak-occupancy", label: "Peak Occupancy"},
                    ]}
                  />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardBody className="insights-space-detail-daily-metrics-card-body">
            {view === VISIBLE ? (() => {
              if (data.length > GRAPH_TYPE_TRANSITION_POINT_IN_DAYS) {
                // For more than two weeks of data, show the graph chart.
                return <div className="large-timespan-chart">
                  <LineChartComponent
                    timeZone={space.timeZone}
                    svgWidth={975}
                    svgHeight={370}

                    xAxis={xAxisDailyTick({
                      // Calculate a tick resolutino that makes sense given the selected time range.
                      tickResolutionInMs: (() => {
                        const duration = moment.duration(
                          moment.utc(endDate).diff(moment.utc(startDate))
                        );
                        const durationDays = duration.asDays();
                        if (durationDays > 30) {
                          return 3 * ONE_DAY_IN_MS;
                        } else if (durationDays > 14) {
                          return 1 * ONE_DAY_IN_MS;
                        } else {
                          return 0.5 * ONE_DAY_IN_MS;
                        }
                      })(),
                      formatter: n => moment.utc(n).tz(space.timeZone).format(`MM/DD`),
                    })}

                    yAxis={yAxisMinMax({})}
                    yAxisStart={0}

                    overlays={[
                      overlayTwoPopups({
                        topPopupFormatter: overlayTwoPopupsPlainTextFormatter(item => {
                          const unit = (function(metric) {
                            switch (metric) {
                              case 'entrances': return 'Entrances';
                              case 'exits': return 'Exits';
                              case 'total-events': return 'Total Events';
                              case 'peak-occupancy': return 'Peak Occupancy';
                              default: return 'People';
                            }
                          })(metricToDisplay);
                          return `${Math.round(item.value)} ${unit}`;
                        }, 'top'),
                        bottomPopupFormatter: overlayTwoPopupsPlainTextFormatter(
                          (item, {mouseX, xScale}) => {
                            const timestamp = moment.utc(xScale.invert(mouseX)).tz(space.timeZone);
                            return timestamp.format(`ddd MMM DD YYYY`);
                          }
                        ),

                        bottomOverlayTopMargin: 40,
                        topOverlayBottomMargin: 20,

                        topOverlayWidth: metricToDisplay === 'peak-occupancy' ? 180 : 150,
                        topOverlayHeight: 42,
                        bottomOverlayWidth: 150,
                        bottomOverlayHeight: 42,
                      }),
                    ]}

                    data={[
                      {
                        name: 'default',
                        type: dataWaterline,
                        verticalBaselineOffset: 10,
                        data: data.sort(
                          (a, b) => moment.utc(a.timestamp).valueOf() - moment.utc(b.timestamp).valueOf()
                        ),
                      },
                    ]}
                  />
                </div>;
              } else {
                // Less than two weeks should stil use the daily metrics chart.
                return <div className="short-timespan-chart">
                  <DailyMetricsComponent
                    data={data.map(i => {
                      return {
                        // Remove the offset that was added when the data was fetched.
                        label: moment.utc(i.timestamp).tz(space.timeZone).format('MM/DD'),
                        value: i.value,
                      };
                    })}
                    width={975}
                    height={350}
                  />
                </div>;
              }
            })() : null}

            {view === ERROR ? <div className="insights-space-detail-daily-metrics-card-body-error">
              <span>
                <span className="insights-space-detail-daily-metrics-card-body-error-icon">&#xe91a;</span>
                {error.toString()}
              </span>
            </div> : null }

            {view === EMPTY ? <div className="insights-space-detail-daily-metrics-card-body-info">
              No data available for this time range.
            </div> : null }

            {view === LOADING ? <div className="insights-space-detail-daily-metrics-card-body-info">
              Generating Data&nbsp;.&nbsp;.&nbsp;.
            </div> : null }
          </CardBody>
        </Card>
      );
    } else {
      return null;
    }
  }
}
