import * as React from 'react';

import moment from 'moment';
import 'moment-timezone';

import { core } from '../../client';

import gridVariables from '@density/ui/variables/grid.json';
import Card, { CardHeader, CardBody, CardLoading } from '@density/ui-card';
import InputBox from '@density/ui-input-box';

import { isInclusivelyBeforeDay, isInclusivelyAfterDay } from '@density/react-dates';
import DateRangePicker, { ANCHOR_RIGHT, ANCHOR_LEFT } from '@density/ui-date-range-picker';

import fetchAllPages from '../../helpers/fetch-all-pages/index';
import formatPercentage from '../../helpers/format-percentage/index';

import spaceUtilizationPerGroup, {
  groupCountsByDay,
  groupCountFilter,
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

      startDate: moment.utc().subtract(7, 'days').format(),
      endDate: moment.utc().subtract(1, 'day').format(),
      timeSegment: 'WORKING_HOURS',
    };
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

    // Remove all data in each bucket that is outside each time segment.
    const filteredGroups = groupCountFilter(groups, count =>
      isWithinTimeSegment(count.timestamp, space.timeZone, TIME_SEGMENTS[this.state.timeSegment]));

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
    });
  }

  calculateAverageUtilization(data=this.state.data) {
    const utilizationSum = data.reduce((acc, i) => acc + i.averageUtilization, 0);
    return utilizationSum / data.length;
  }

  render() {
    const {space} = this.props;
    if (space && space.id !== this.state.dataSpaceId) {
      this.fetchData.call(this);
    }

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


      // Calculate the peak utilization of the space by getting the peak count within the raw count
      // data that was fetched and dividing it by the capacity.
      const peak = this.state.counts.reduce(
        (peak, i) => i.count > peak.count ? i : peak, /* find the maximum value of i.count */
        {count: -1, timestamp: null}
      );
      peakUtilizationPercentage = peak.count / space.capacity;
      peakUtilizationTimestamp = peak.timestamp;
      


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

      // console.log(averageUtilizationDatapointsWithTimestamp)
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

        <CardBody>
          {this.state.state === VISIBLE ? <div>
            <span>
              Average utilization: {formatPercentage(this.calculateAverageUtilization())} %
              Average monday utilization: {formatPercentage(this.calculateAverageUtilization(utilizationsByDay[0]))} %
              Average tuesday utilization: {formatPercentage(this.calculateAverageUtilization(utilizationsByDay[1]))} %
              Average wednesday utilization: {formatPercentage(this.calculateAverageUtilization(utilizationsByDay[2]))} %
              Average thursday utilization: {formatPercentage(this.calculateAverageUtilization(utilizationsByDay[3]))} %
              Average friday utilization: {formatPercentage(this.calculateAverageUtilization(utilizationsByDay[4]))} %
              Peak Utilization: {formatPercentage(peakUtilizationPercentage)} % at {peakUtilizationTimestamp}
            </span>
            <HistoricalCountsComponent
              data={averageUtilizationDatapointsWithTimestamp}
              width={950}
              height={350}
              capacity={100}
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
        </CardBody>
      </Card>;
    } else {
      return <span>This space doesn't exist.</span>;
    }
  }
}
