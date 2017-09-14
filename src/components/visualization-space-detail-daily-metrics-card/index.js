import * as React from 'react';

import moment from 'moment';
import 'moment-timezone';

import { core } from '@density-int/client';
import Card, { CardHeader, CardBody } from '@density/ui-card';
import { isInclusivelyBeforeDay, isInclusivelyAfterDay } from '@density/react-dates';
import DateRangePicker, { ANCHOR_RIGHT } from '@density/ui-date-range-picker';
import InputBox from '@density/ui-input-box';

import dailyMetrics from '@density/chart-daily-metrics';
import { chartAsReactComponent } from '@density/charts';
const DailyMetricsComponent = chartAsReactComponent(dailyMetrics);

const LOADING = 'LOADING',
      EMPTY = 'EMPTY',
      VISIBLE = 'VISIBLE',
      ERROR = 'ERROR';

// The maximum number of days that can be selected by the date range picker
const MAXIMUM_DAY_LENGTH = 14;
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
    const startTime = moment.utc(this.state.startDate).startOf('day').subtract(hoursOffsetFromUtc, 'hours');
    const endTime = moment.utc(this.state.endDate).startOf('day').add(1, 'day').subtract(hoursOffsetFromUtc, 'hours');

    // There are two different endpoints thata re used here for data fetching.
    // 1. The events endpoint, for fetching total entrances, exits, and all events in a range of time
    // 2. The counts endpoint, for fetching peak count for a range of time.
    if (metric === 'entrances' || metric === 'exits' || metric === 'total-events') {
      // Events endpoint
      // Recursively fetch as many pages of events as possible within the defined region of time.
      // This is required because we are aggregating events, and want to make sure we have all
      // events for the time range, even if there are more events than the `page_size`.
      function fetchAllEvents(page=1) {
        return core.spaces.events({
          id: space.id,
          start_time: startTime.format(),
          end_time: endTime.format(),
          page,
          page_size: 1000,

          // Filter by direction?
          direction: (function(metric) {
            if (metric === 'entrances') {
              return 1;
            } else if (metric === 'exits') {
              return -1;
            } else {
              return '';
            }
          })(metric),
        }).then(data => {
          if (data.next) {
            return fetchAllEvents(page + 1).then(nextData => {
              return [...data.results, ...nextData];
            });
          } else {
            // Hit end of range. All events fetched!
            return data.results;
          }
        });
      }

      return fetchAllEvents().then(data => {
        if (data.length > 0) {
          const initialDays = {};

          // Preset all days in the date range to zero within an object.
          let dayAccumulator = startTime.clone().subtract(this.state.hoursOffsetFromUtc, 'hours');
          while (endTime.diff(dayAccumulator, 'days') > 0) {
            initialDays[dayAccumulator.startOf('day').format()] = 0;
            dayAccumulator = dayAccumulator.add(1, 'day');
          }

          // Determine the number of events that were returned per day, and add them to this object.
          const eventsPerDay = data.reduce((acc, i) => {
            const day = moment.utc(i.timestamp).startOf('day').format();
            return {...acc, [day]: acc[day] + 1};
          }, initialDays);

          // Convert the object into an array.
          let events = [];
          for (const i in eventsPerDay) {
            events.push({timestamp: i, value: eventsPerDay[i]});
          }

          this.setState({
            state: VISIBLE,
            dataSpaceId: space.id,
            hoursOffsetFromUtc,
            data: events,
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
    } else {
      // Counts endpoint
      return core.spaces.counts({
        id: space.id,
        start_time: startTime.format(),
        end_time: endTime.format(),
        interval: '1d',
      }).then(data => {
        if (data.results.length > 0) {
          this.setState({
            state: VISIBLE,
            dataSpaceId: space.id,
            hoursOffsetFromUtc,
            // Return the maximum count within the window of time.
            data: data.results.reverse().map(i => ({
              timestamp: i.timestamp,
              value: i.interval.analytics.max,
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
  }
  render() {
    const {space} = this.props;
    if (space && space.id !== this.state.dataSpaceId) {
      this.fetchData.call(this);
    }

    if (space) {
      return <Card className="visualization-space-detail-card">
        <CardHeader className="visualization-space-detail-daily-metrics-card-header">
          <span className="visualization-space-detail-daily-metrics-card-header-label">Daily Metrics</span>
          <div className="visualization-space-detail-daily-metrics-card-metric-picker">
            <InputBox
              type="select"
              value={this.state.metricToDisplay}
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
              <option value="peak-counts">Peak Counts</option>
            </InputBox>
          </div>
          <div className="visualization-space-detail-daily-metrics-card-date-picker">
            <DateRangePicker
              startDate={moment.utc(this.state.startDate)}
              endDate={moment.utc(this.state.endDate)}
              onChange={({startDate, endDate}) => {
                // If the user selected over 14 days, then clamp them back to 14 days.
                if (startDate && endDate && endDate.diff(startDate, 'days') > MAXIMUM_DAY_LENGTH) {
                  endDate = startDate.clone().add(INITIAL_RANGE_SELECTION-1, 'days');
                }

                // Update the start and end date with the values selected.
                this.setState({
                  startDate: startDate ? startDate.format() : undefined,
                  endDate: endDate ? endDate.format() : undefined,
                }, () => {
                  // If the start date and end date were both set, then load data.
                  if (this.state.startDate && this.state.endDate) {
                    this.setState({ state: LOADING, data: null}, () => {
                      this.fetchData();
                    });
                  }
                });
              }}
              focusedInput={this.state.datePickerInput}
              onFocusChange={focused => this.setState({datePickerInput: focused})}
              anchor={ANCHOR_RIGHT}

              isOutsideRange={day => isOutsideRange(
                this.state.startDate,
                this.state.datePickerInput,
                day
              )}
            />
          </div>
        </CardHeader>

        <CardBody className="visualization-space-detail-daily-metrics-card-body">
          {this.state.state === VISIBLE ? <DailyMetricsComponent
            data={this.state.data.map(i => {
              return {
                // Remove the offset that was added when the data was fetched.
                label: moment.utc(i.timestamp).subtract(this.state.hoursOffsetFromUtc, 'hours').format('MM/DD'),
                value: i.value,
              };
            })}
            width={930}
            height={350}
          /> : <div className="visualization-space-detail-daily-metrics-card-body-empty" />}
        </CardBody>
      </Card>;
    } else {
      return <span>This space doesn't exist.</span>;
    }
  }
}
