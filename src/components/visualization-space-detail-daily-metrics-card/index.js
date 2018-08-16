import React from 'react';
import classnames from 'classnames';

import moment from 'moment';
import 'moment-timezone';

import { core } from '../../client';
import Card, { CardHeader, CardBody, CardLoading } from '@density/ui-card';
import { isInclusivelyBeforeDay, isInclusivelyAfterDay } from '@density/react-dates';
import DateRangePicker, { ANCHOR_RIGHT, ANCHOR_LEFT } from '@density/ui-date-range-picker';
import InputBox from '@density/ui-input-box';
import { IconRefresh } from '@density/ui-icons';

import commonRanges from '../../helpers/common-ranges';

import gridVariables from '@density/ui/variables/grid.json'

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

// When the user selects a start date, select a range that's this long. THe user can stil ladjust
// the range up to a maximum length of `MAXIMUM_DAY_LENGTH` though.
const INITIAL_RANGE_SELECTION = MAXIMUM_DAY_LENGTH / 2;

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

export default class VisualizationSpaceDetailDailyMetricsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: LOADING,
      data: null,
      dataSpaceId: null,

      datePickerInput: null,
      hoursOffsetFromUtc: 0,
      metricToDisplay: 'entrances',

      startDate: null,
      endDate: null,
    };
  }

  fetchData() {
    const {space} = this.props;
    const metric = this.state.metricToDisplay;

    // Add timezone offset to both start and end times prior to querying for the count.
    const hoursOffsetFromUtc = parseInt(moment.tz(space.timeZone).format('Z').split(':')[0], 10);
    const startTime = moment.utc(this.state.startDate).tz(space.timeZone).startOf('day');
    const endTime = moment.utc(this.state.endDate).tz(space.timeZone).startOf('day');

    // Fetch data from the server for the day-long window.
    return core.spaces.counts({
      id: space.id,
      start_time: startTime.format(),
      // Add a day to the end of the range to return a final bar of the data for the uncompleted
      // current day.
      end_time: endTime.add(1, 'day').format(),
      interval: '1d',
      order: 'asc',
    }).then(data => {
      if (data.results.length > 0) {
        this.setState({
          state: VISIBLE,
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
            })(i, metric) || 0,
          })),
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

  // updates the state's `startDate` and `endDate` and triggers a `fetchData`
  setDatesAndFetchData(startDate, endDate) {
    // Update the start and end date with the values selected.
    this.setState({startDate, endDate}, () => {
      // If the start date and end date were both set, then load data.
      if (this.state.startDate && this.state.endDate) {
        this.setState({ state: LOADING, data: null }, () => {
          this.fetchData();
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.startDate !== this.state.startDate ||
      nextProps.endDate !== this.state.endDate
    ) {
      this.setState({
        startDate: nextProps.startDate,
        endDate: nextProps.endDate,
      }, () => {
        this.setDatesAndFetchData(nextProps.startDate, nextProps.endDate);
      });
    }
  }

  render() {
    const {space} = this.props;
    if (space) {
      return <Card className="visualization-space-detail-card">
        {this.state.state === LOADING ? <CardLoading indeterminate /> : null }
        <CardHeader>
          <div className="insights-space-detail-daily-metrics-card-header-container">
            <span className="insights-space-detail-daily-metrics-card-header-label">
              Daily Metrics
            </span>
            <span
              className={classnames('insights-space-detail-utilization-card-header-refresh', {
                disabled: this.state.state !== VISIBLE,
              })}
              onClick={() => this.setState({
                state: LOADING,
                data: null,
              }, () => this.fetchData.call(this))}
            >
              <IconRefresh color={this.state.state === LOADING ? 'gray' : 'primary'} />
            </span>
            <div className="visualization-space-detail-daily-metrics-card-metric-picker">
              <InputBox
                type="select"
                value={this.state.metricToDisplay}
                disabled={this.state.state !== VISIBLE}
                onChange={e => {
                  this.setState({
                    state: LOADING,
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
        </CardHeader>

        <CardBody className="visualization-space-detail-daily-metrics-card-body">
          {this.state.state === VISIBLE ? (() => {
            if (this.state.data.length > GRAPH_TYPE_TRANSITION_POINT_IN_DAYS) {
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
                        moment.utc(this.state.endDate).diff(moment.utc(this.state.startDate))
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
                        })(this.state.metricToDisplay);
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

                      topOverlayWidth: this.state.metricToDisplay === 'peak-occupancy' ? 180 : 150,
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
                      data: this.state.data.sort(
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
                  data={this.state.data.map(i => {
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

          {this.state.state === ERROR ? <div className="visualization-space-detail-daily-metrics-card-body-error">
            <span>
              <span className="visualization-space-detail-daily-metrics-card-body-error-icon">&#xe91a;</span>
              {this.state.error.toString()}
            </span>
          </div> : null }

          {this.state.state === EMPTY ? <div className="visualization-space-detail-daily-metrics-card-body-info">
            No data available for this time range.
          </div> : null }

          {this.state.state === LOADING ? <div className="visualization-space-detail-daily-metrics-card-body-info">
            Generating Data&nbsp;.&nbsp;.&nbsp;.
          </div> : null }
        </CardBody>
      </Card>;
    } else {
      return <span>This space doesn't exist.</span>;
    }
  }
}
