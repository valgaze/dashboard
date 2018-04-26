import * as React from 'react';

import moment from 'moment';
import 'moment-timezone';

import { core } from '../../client';
import Card, { CardHeader, CardBody, CardLoading } from '@density/ui-card';
import { isInclusivelyBeforeDay, isInclusivelyAfterDay } from '@density/react-dates';
import DateRangePicker, { ANCHOR_RIGHT, ANCHOR_LEFT } from '@density/ui-date-range-picker';
import InputBox from '@density/ui-input-box';

import commonRanges from '../../helpers/common-ranges';

import gridVariables from '@density/ui/variables/grid.json'

import dailyMetrics from '@density/chart-daily-metrics';
import historicalCounts from '@density/chart-historical-counts';

import { chartAsReactComponent } from '@density/charts';
const DailyMetricsComponent = chartAsReactComponent(dailyMetrics);
const HistoricalCountsComponent = chartAsReactComponent(historicalCounts);

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

      startDate: moment.utc().subtract(6, 'days').format(),
      endDate: moment.utc().format(),
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
    this.setState({
      startDate: startDate ? startDate.format() : undefined,
      endDate: endDate ? endDate.format() : undefined,
    }, () => {
      // If the start date and end date were both set, then load data.
      if (this.state.startDate && this.state.endDate) {
        this.setState({ state: LOADING, data: null }, () => {
          this.fetchData();
        });
      }
    });
  }

  render() {
    const {space} = this.props;
    if (space && space.id !== this.state.dataSpaceId) {
      this.fetchData.call(this);
    }

    if (space) {
      return <Card className="visualization-space-detail-card">
        { this.state.state === LOADING ? <CardLoading indeterminate /> : null }
        <CardHeader className="visualization-space-detail-daily-metrics-card-header">
          <span className="visualization-space-detail-daily-metrics-card-header-label">
            Daily Metrics
            <span
              className="visualization-space-detail-daily-metrics-card-header-refresh"
              onClick={() => this.setState({
                state: LOADING,
                data: null,
              }, () => this.fetchData.call(this))}
            />
          </span>
          <div className="visualization-space-detail-daily-metrics-card-metric-picker">
            <InputBox
              type="select"
              value={this.state.metricToDisplay}
              disabled={this.state.state === EMPTY || this.state.state === ERROR}
              onChange={e => {
                this.setState({
                  state: LOADING,
                  data: null,
                  metricToDisplay: e.target.value,
                }, () => this.fetchData());
              }}
            >
              <option value="entrances">Entrances</option>
              <option value="exits">Exits</option>
              <option value="total-events">Total Events</option>
              <option value="peak-occupancy">Peak Occupancy</option>
            </InputBox>
          </div>
          <div className="visualization-space-detail-daily-metrics-card-date-picker">
            <DateRangePicker
              startDate={moment.utc(this.state.startDate).tz(space.timeZone).startOf('day')}
              endDate={moment.utc(this.state.endDate).tz(space.timeZone).startOf('day')}
              onChange={({startDate, endDate}) => {
                // If the user selected over 14 days, then clamp them back to 14 days.
                if (startDate && endDate && endDate.diff(startDate, 'days') > MAXIMUM_DAY_LENGTH) {
                  endDate = startDate.clone().add(INITIAL_RANGE_SELECTION-1, 'days');
                }

                this.setDatesAndFetchData(startDate, endDate);
              }}
              // Within the component, store if the user has selected the start of end date picker
              // input
              focusedInput={this.state.datePickerInput}
              onFocusChange={focused => this.setState({datePickerInput: focused})}

              // On mobile, make the calendar one month wide and left aligned.
              // On desktop, the calendar is two months wide and right aligned.
              anchor={document.body && document.body.clientWidth > gridVariables.screenSmMin ? ANCHOR_RIGHT : ANCHOR_LEFT}
              numberOfMonths={document.body && document.body.clientWidth > gridVariables.screenSmMin ? 2 : 1}

              isOutsideRange={day => isOutsideRange(
                this.state.startDate,
                this.state.datePickerInput,
                day
              )}

              // common ranges functionality
              commonRanges={commonRanges}
              onSelectCommonRange={(r) => this.setDatesAndFetchData(r.startDate, r.endDate)}
              showCommonRangeSubtitles={true}
            />
          </div>
        </CardHeader>

        <CardBody className="visualization-space-detail-daily-metrics-card-body">
          {this.state.state === VISIBLE ? (() => {
            if (this.state.data.length > GRAPH_TYPE_TRANSITION_POINT_IN_DAYS) {
              // For more than two weeks of data, show the graph chart.
              return <div className="large-timespan-chart">
                <HistoricalCountsComponent
                  data={this.state.data.map(i => {
                    return {
                      timestamp: i.timestamp,
                      count: i.value,
                    };
                  })}
                  width={950}
                  height={350}
                  timeZone={space.timeZone}
                  xAxisResolution="week"
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
              {this.state.error}
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
