import * as React from 'react';

import moment from 'moment';
import 'moment-timezone';

import { core } from '../../client';

import gridVariables from '@density/ui/variables/grid.json';
import Card, { CardHeader, CardBody, CardLoading } from '@density/ui-card';
import InputBox from '@density/ui-input-box';

import PercentageBar from '../percentage-bar/index';

import { isInclusivelyBeforeDay, isInclusivelyAfterDay } from '@density/react-dates';
import DateRangePicker, { ANCHOR_RIGHT, ANCHOR_LEFT } from '@density/ui-date-range-picker';

import fetchAllPages from '../../helpers/fetch-all-pages/index';
import formatPercentage from '../../helpers/format-percentage/index';

import getTimeZoneGeneralizedShortName from '../../helpers/get-time-zone-generalized-short-name/index';

import spaceUtilizationPerGroup, {
  groupCountsByDay,
  isWithinTimeSegment,
  TIME_SEGMENTS,
} from '../../helpers/space-utilization/index';

import historicalCounts from '@density/chart-historical-counts';
import { chartAsReactComponent } from '@density/charts';
const HistoricalCountsComponent = chartAsReactComponent(historicalCounts);

// Given a day on the calendar and the current day, determine if the square on the calendar should
// be grayed out or not.
function isOutsideRange(startISOTime, datePickerInput, day) {
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

export const LOADING = 'LOADING',
             EMPTY = 'EMPTY',
             VISIBLE = 'VISIBLE',
             REQUIRES_CAPACITY = 'REQUIRES_CAPACITY',
             ERROR = 'ERROR';

// The maximum number of days that can be selected by the date range picker
const MAXIMUM_DAY_LENGTH = 3 * 31; // Three months of data

// When the user selects a start date, select a range that's this long. THe user can stil ladjust
// the range up to a maximum length of `MAXIMUM_DAY_LENGTH` though.
const INITIAL_RANGE_SELECTION = MAXIMUM_DAY_LENGTH / 2;

export default class InsightsSpaceDetailUtilizationCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      state: LOADING,

      groups: null,
      data: null,
      dataSpaceId: null,

      startDate: moment.utc().tz(this.props.space.timeZone).subtract(7, 'days').startOf('day').format(),
      endDate: moment.utc().tz(this.props.space.timeZone).subtract(1, 'day').endOf('day').format(),
      timeSegment: 'WORKING_HOURS',
    };

    // Fetch initial data
    this.fetchData.call(this);
  }

  async fetchData() {
    const { space } = this.props;

    if (!space.capacity) {
      setTimeout(() => {
        this.setState({
          state: REQUIRES_CAPACITY,

          // Along with the utilization data, store the space id that the data has been calculated for.
          // In this way, if the space id changes, then we know to refetch utilization data.
          dataSpaceId: space.id,
        });
      }, 0);
      return;
    }

    // Step 1: Fetch all counts--which means all pages--of data from the start date to the end data
    // selected on the DateRangePicker. Uses the `fetchAllPages` helper, which encapsulates the
    // logic required to fetch all pages of data from the server.
    const counts = await fetchAllPages(page => {
      return core.spaces.counts({
        id: space.id,

        start_time: this.state.startDate,
        end_time: this.state.endDate,

        interval: function(timeSegment) {
          const numberOfHoursVisible = TIME_SEGMENTS[timeSegment].end - TIME_SEGMENTS[timeSegment].start;
          if (numberOfHoursVisible > 4) {
            // For large graphs, fetch data at a coarser resolution.
            return '10m';
          } else {
            // For small graphs, fetch data at a finer resolution.
            return '2m';
          }
        }(this.state.timeSegment),

        // Fetch with a large page size to try to minimize the number of requests that will be
        // required.
        page,
        page_size: 1000,
      });
    });

    // Group into counts into buckets, one bucket for each day.
    const groups = groupCountsByDay(counts, space.timeZone);

    const filteredGroups = groups.filter(group => {
      // Filter out any days that aren't within monday-friday
      const dayOfWeek = moment.utc(group.date, 'YYYY-MM-DD').tz(space.timeZone).isoWeekday();
      return dayOfWeek !== 5 && dayOfWeek !== 6 // Remove saturday and sunday
    }).map(group => {
      // Remove all counts in each bucket that is outside each time segment.
      return {
        ...group,
        counts: group.counts.filter(count => {
          return isWithinTimeSegment(
            count.timestamp,
            space.timeZone,
            TIME_SEGMENTS[this.state.timeSegment]
          );
        }),
      };
    });

    // Calculate space utilization using this dat with un-important time segments removed.
    const utilizations = spaceUtilizationPerGroup(space, filteredGroups);

    this.setState({
      state: VISIBLE,

      counts,
      groups,
      data: utilizations,

      // Along with the utilization data, store the space id that the data has been calculated for.
      // In this way, if the space id changes, then we know to refetch utilization data.
      dataSpaceId: space.id,
      dataSpaceCapacity: space.capacity,
    });
  }

  calculateAverageUtilization(data=this.state.data) {
    const utilizationSum = data.reduce((acc, i) => acc + i.averageUtilization, 0);
    return utilizationSum / data.length;
  }

  componentWillReceiveProps({space}) {
    if (space && (space.id !== this.state.dataSpaceId || space.capacity !== this.state.dataSpaceCapacity)) {
      this.setState({state: LOADING}, () => this.fetchData.call(this));
    }
  }

  render() {
    const {space} = this.props;

    let utilizationsByDay,
      peakUtilizationPercentage, peakUtilizationTimestamp,
      averageUtilizationDatapointsWithTimestamp;

    if (this.state.state === VISIBLE) {
      //

      // Calculate the average utilization for each day within the specified time segment.
      utilizationsByDay = this.state.data.reduce((acc, i) => {
        const dayOfWeek = moment.utc(i.date, 'YYYY-MM-DD').tz(space.timeZone).day();
        acc[dayOfWeek].push(i);
        return acc;
      }, [[], [], [], [], [], [], []]);


      // Calculate an average day's utilization graph.
      let averageUtilizationDatapoints = this.state.data[0].utilization.map(_ => 0);

      // The average calculation is split into two parts: the sum and the division.
      // - The sum part of the average (step 1) occurs below.
      // - `dataPointCount` contains the number of samples that have been summed together and is the
      // number that will be divided by later to complete the average.
      let dataPointCount = 0;
      this.state.data.forEach(group => {
        if (Array.isArray(group.utilization)) {
          averageUtilizationDatapoints = averageUtilizationDatapoints.map((i, ct) => i + group.utilization[ct])
          dataPointCount += 1;
        }
      });

      // 
      const dataDuration = TIME_SEGMENTS[this.state.timeSegment].end - TIME_SEGMENTS[this.state.timeSegment].start;

      const stamp = moment.utc(this.state.counts[0].timestamp)
        .startOf('day')
        .add(TIME_SEGMENTS[this.state.timeSegment].start, 'hours');

      averageUtilizationDatapointsWithTimestamp = averageUtilizationDatapoints
        .map(i => i / dataPointCount) /* second part of calculating average */
        .map(i => Math.round(i * 1000) / 1000) /* round each number to a single decimal place */
        .map((i, ct) => ({
          timestamp: stamp.add(dataDuration / averageUtilizationDatapoints.length, 'hours').format(),
          count: i * 100,
        }))

      // Calculate the peak utilization of the space by getting the peak count within the raw count
      // data that was fetched and dividing it by the capacity.
      peakUtilizationPercentage = 0;
      peakUtilizationTimestamp = null; /* No peak utilization */
      averageUtilizationDatapointsWithTimestamp.forEach(c => {
        if (c.count > peakUtilizationPercentage) {
          peakUtilizationPercentage = c.count;
          peakUtilizationTimestamp = c.timestamp;
        }
      });
      peakUtilizationPercentage /= 100;
    }

    if (space) {
      return <Card className="insights-space-detail-utilization-card">
        { this.state.state === LOADING ? <CardLoading indeterminate /> : null }
        <CardHeader className="insights-space-detail-utilization-card-header">
          <span className="insights-space-detail-utilization-card-header-label">
            Space Utilization
            <span
              className="insights-space-detail-utilization-card-header-refresh"
              onClick={() => this.setState({
                state: LOADING,
                data: null,
              }, () => this.fetchData.call(this))}
            />
            <span className="insights-space-detail-utilization-card-header-timespan">
              (Monday &mdash; Friday)
            </span>
          </span>

          <div className="insights-space-detail-utilization-card-time-segment-picker">
            <InputBox
              type="select"
              className="insights-space-list-time-segment-selector"
              value={this.state.timeSegment}
              onChange={e => {
                this.setState({
                  state: LOADING,
                  timeSegment: e.target.value,
                }, () => this.fetchData());
              }}
            >
              {Object.keys(TIME_SEGMENTS).map(i => [i, TIME_SEGMENTS[i]]).map(([key, {start, end, name}]) => {
                return <option value={key} key={key}>
                  {name} ({start > 12 ? `${start-12}p` : `${start}a`} - {end > 12 ? `${end-12}p` : `${end}a`})
                </option>;
              })}
            </InputBox>
          </div>
          <div className="insights-space-detail-utilization-card-date-picker">
            <DateRangePicker
              startDate={moment.utc(this.state.startDate).tz(space.timeZone).startOf('day')}
              endDate={moment.utc(this.state.endDate).tz(space.timeZone).startOf('day')}
              onChange={({startDate, endDate}) => {
                // If the user selected over 3 months, then clamp them back to 3 months.
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
            />
          </div>
        </CardHeader>

        {this.state.state === VISIBLE ? <div>
          <CardBody className="insights-space-detail-utilization-card-well">
            Average utilization of
            <span className="insights-space-detail-utilization-card-well-highlight">
              {Math.round(this.calculateAverageUtilization() * 100)}%
            </span>
            during
            <span className="insights-space-detail-utilization-card-well-highlight">
              {TIME_SEGMENTS[this.state.timeSegment].phrasal}
            </span>
          </CardBody>
          <CardHeader>
            <span className="insights-space-detail-utilization-card-header-label">
              Average Weekly Breakdown
              <span className="insights-space-detail-utilization-card-header-timespan">
                {moment.utc(this.state.startDate, 'YYYY-MM-DDTHH:mm:ssZ').format('MMMM D')}
                &nbsp;&mdash;&nbsp;
                {moment.utc(this.state.endDate, 'YYYY-MM-DDTHH:mm:ssZ').format('MMMM D')}
                &nbsp;
                <span className="insights-space-detail-utilization-card-header-label-highlight">
                  ({TIME_SEGMENTS[this.state.timeSegment].name})
                </span>
              </span>
            </span>
          </CardHeader>
          <CardBody>
            <div className="insights-space-detail-utilization-card-grid-header">
              <div className="insights-space-detail-utilization-card-grid-item">Space</div>
              <div className="insights-space-detail-utilization-card-grid-item">Average Utilization</div>
            </div>

            <div className="insights-space-detail-utilization-card-grid-row">
              <div className="insights-space-detail-utilization-card-grid-item">Monday</div>
              <div className="insights-space-detail-utilization-card-grid-item">
                <PercentageBar
                  percentage={this.calculateAverageUtilization(utilizationsByDay[0])}
                  percentageFormatter={percentage => `${formatPercentage(percentage, 0)}%`}
                />
              </div>
            </div>
            <div className="insights-space-detail-utilization-card-grid-row">
              <div className="insights-space-detail-utilization-card-grid-item">Tuesday</div>
              <div className="insights-space-detail-utilization-card-grid-item">
                <PercentageBar
                  percentage={this.calculateAverageUtilization(utilizationsByDay[1])}
                  percentageFormatter={percentage => `${formatPercentage(percentage, 0)}%`}
                />
              </div>
            </div>
            <div className="insights-space-detail-utilization-card-grid-row">
              <div className="insights-space-detail-utilization-card-grid-item">Wednesday</div>
              <div className="insights-space-detail-utilization-card-grid-item">
                <PercentageBar
                  percentage={this.calculateAverageUtilization(utilizationsByDay[2])}
                  percentageFormatter={percentage => `${formatPercentage(percentage, 0)}%`}
                />
              </div>
            </div>
            <div className="insights-space-detail-utilization-card-grid-row">
              <div className="insights-space-detail-utilization-card-grid-item">Thursday</div>
              <div className="insights-space-detail-utilization-card-grid-item">
                <PercentageBar
                  percentage={this.calculateAverageUtilization(utilizationsByDay[3])}
                  percentageFormatter={percentage => `${formatPercentage(percentage, 0)}%`}
                />
              </div>
            </div>
            <div className="insights-space-detail-utilization-card-grid-row">
              <div className="insights-space-detail-utilization-card-grid-item">Friday</div>
              <div className="insights-space-detail-utilization-card-grid-item">
                <PercentageBar
                  percentage={this.calculateAverageUtilization(utilizationsByDay[4])}
                  percentageFormatter={percentage => `${formatPercentage(percentage, 0)}%`}
                />
              </div>
            </div>

          </CardBody>
          <CardBody className="insights-space-detail-utilization-card-well">
            {peakUtilizationTimestamp === null ? <span>
              No peak utilization during
              <span className="insights-space-detail-utilization-card-well-highlight">
                {TIME_SEGMENTS[this.state.timeSegment].phrasal}
              </span>
            </span> : <span>
              On average, peak utilization of 
              <span className="insights-space-detail-utilization-card-well-highlight">
                {Math.round(peakUtilizationPercentage * 100)}%
              </span>
              happens around
              <span className="insights-space-detail-utilization-card-well-highlight">
                {(timestamp => {
                  const stamp = moment.utc(timestamp, 'YYYY-MM-DDTHH:mm:ssZ');
                  let minute = '00';

                  if (stamp.minute() >= 45) {
                    minute = '45';
                  } else if (stamp.minute() >= 30) {
                    minute = '30';
                  } else if (stamp.minute() >= 15) {
                    minute = '15';
                  }
                  
                  return stamp.format(`h:[${minute}]a`).slice(0, -1)
                })(peakUtilizationTimestamp)}
              </span>
              during
              <span className="insights-space-detail-utilization-card-well-highlight">
                {TIME_SEGMENTS[this.state.timeSegment].phrasal}
              </span>
            </span>}
          </CardBody>
          <CardHeader>
            <span className="insights-space-detail-utilization-card-header-label">
              Average Daily Breakdown
              <span className="insights-space-detail-utilization-card-header-timespan">
                {moment.utc(this.state.startDate, 'YYYY-MM-DDTHH:mm:ssZ').format('MMMM D')}
                &nbsp;&mdash;&nbsp;
                {moment.utc(this.state.endDate, 'YYYY-MM-DDTHH:mm:ssZ').format('MMMM D')}
                &nbsp;
                <span className="insights-space-detail-utilization-card-header-label-highlight">
                  ({TIME_SEGMENTS[this.state.timeSegment].name})
                </span>
              </span>
            </span>
          </CardHeader>
          <HistoricalCountsComponent
            data={averageUtilizationDatapointsWithTimestamp}
            width={950}
            height={350}
            capacity={100}

            yAxisLabelFormat={n => {
              if (n === 0 || n === 100) {
                return `${formatPercentage(n / 100, 0)}%`;
              } else {
                return '';
              }
            }}
            bottomOverlayLabelFormat={n => {
              console.log('N', n)
              const stamp = moment.utc(n).tz(space.timeZone);
              const timeZoneLabel = getTimeZoneGeneralizedShortName(space.timeZone);
              return `Avg. Weekday at ${stamp.format('h:mm a')} (${timeZoneLabel})`;
            }}
            topOverlayLabelFormat={n => `${formatPercentage(n / 100, 0)}% Utilization`}
            timeZoneFormat={getTimeZoneGeneralizedShortName}
            renderPersonIcon={false}
          />
        </div> : null}
        {this.state.state === LOADING ? <div className="insights-space-detail-utilization-card-body-info">
          <span>Generating Data...</span>
        </div> : null}
        {this.state.state === REQUIRES_CAPACITY ? <div className="insights-space-detail-utilization-card-body-info">
          <span>No capacity is set for this space. Capacity is required to calculate utilization.</span>
        </div> : null}
        {this.state.state === EMPTY ? <div className="insights-space-detail-utilization-card-body-info">
          <span>No data found in date range.</span>
        </div> : null}
        {this.state.state === ERROR ? <div className="insights-space-detail-utilization-card-body-info">
          <span>
            <span className="insights-space-detail-utilization-card-body-error-icon">&#xe91a;</span>
            {this.state.error}
          </span>
        </div> : null}
      </Card>;
    } else {
      return <span>This space doesn't exist.</span>;
    }
  }
}
