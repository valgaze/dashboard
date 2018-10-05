import React from 'react';
import classnames from 'classnames';

import moment from 'moment';
import 'moment-timezone';

import {
  getCurrentLocalTimeAtSpace,
  parseISOTimeAtSpace,
  parseFromReactDates,
  formatInISOTime,
  formatForReactDates,
  formatTimeSegmentBoundaryTimeForHumans,
  formatInISOTimeAtSpace,
  getDurationBetweenMomentsInDays,
  parseISOTimeToUTC,
  parseDayAtSpace,
  formatDayAtSpace,
} from '../../helpers/space-time-utilities/index';

import { core } from '../../client';

import Card, { CardHeader, CardBody, CardLoading, CardWell, CardWellHighlight } from '@density/ui-card';
import { IconRefresh } from '@density/ui-icons';
import InfoPopup from '@density/ui-info-popup';

import PercentageBar from '@density/ui-percentage-bar';

import fetchAllPages from '../../helpers/fetch-all-pages/index';
import formatPercentage from '../../helpers/format-percentage/index';

import spaceUtilizationPerGroup, {
  groupCountsByDay,
} from '../../helpers/space-utilization/index';
import {
  DEFAULT_TIME_SEGMENT_GROUP,
  DEFAULT_TIME_SEGMENT,
  parseTimeInTimeSegmentToSeconds,
} from '../../helpers/time-segments/index';

import lineChart, { dataWaterline } from '@density/chart-line-chart';
import { xAxisDailyTick, yAxisMinMax } from '@density/chart-line-chart/dist/axes';
import {
  overlayTwoPopups,
  overlayTwoPopupsPlainTextFormatter,
} from '@density/chart-line-chart/dist/overlays';

import { chartAsReactComponent } from '@density/charts';
const LineChartComponent = chartAsReactComponent(lineChart);

const AVERAGE_WEEKLY_BREAKDOWN_PERCENTAGE_BAR_BREAK_WIDTH_IN_PX = 320;

const ONE_HOUR_IN_SECONDS = 60 * 60;

const DAY_TO_INDEX_IN_UTILIZAITIONS_BY_DAY = {
  'Monday': 0,
  'Tuesday': 1,
  'Wednesday': 2,
  'Thursday': 3,
  'Friday': 4,
  'Saturday': 5,
  'Sunday': 6,
};

export const LOADING = 'LOADING',
             EMPTY = 'EMPTY',
             VISIBLE = 'VISIBLE',
             REQUIRES_CAPACITY = 'REQUIRES_CAPACITY',
             ERROR = 'ERROR';

export default class InsightsSpaceDetailUtilizationCard extends React.Component {
  state = {
    view: LOADING,

    groups: null,
    data: null,
    dataSpaceId: null,

    // Set by props and used to determine when the data should be refetched.
    startDate: null,
    endDate: null,
    includeWeekends: false,

    timeSegmentGroup: DEFAULT_TIME_SEGMENT_GROUP,
    timeSegment: DEFAULT_TIME_SEGMENT,
  }

  fetchData = async () => {
    const { space } = this.props;
    const { timeSegmentGroup, timeSegment } = this.state;

    if (!space.capacity) {
      this.setState({
        view: REQUIRES_CAPACITY,

        // Along with the utilization data, store the space id that the data has been calculated for.
        // In this way, if the space id changes, then we know to refetch utilization data.
        dataSpaceId: space.id,
      });
      return;
    }

    const timeSegmentDurationInSeconds = parseTimeInTimeSegmentToSeconds(timeSegment.end) - parseTimeInTimeSegmentToSeconds(timeSegment.start);

    // Step 1: Fetch all counts--which means all pages--of data from the start date to the end data
    // selected on the DateRangePicker. Uses the `fetchAllPages` helper, which encapsulates the
    // logic required to fetch all pages of data from the server.
    const counts = await fetchAllPages(page => {
      return core.spaces.counts({
        id: space.id,

        start_time: this.state.startDate,
        end_time: this.state.endDate,
        time_segment_groups: timeSegmentGroup.id === DEFAULT_TIME_SEGMENT_GROUP.id ? '' : timeSegmentGroup.id,

        interval: function(timeSegmentDurationInSeconds) {
          if (timeSegmentDurationInSeconds > 4 * ONE_HOUR_IN_SECONDS) {
            // For large graphs, fetch data at a coarser resolution.
            return '10m';
          } else {
            // For small graphs, fetch data at a finer resolution.
            return '2m';
          }
        }(timeSegmentDurationInSeconds),

        // Fetch with a large page size to try to minimize the number of requests that will be
        // required.
        page,
        page_size: 1000,
      });
    });

    // Group into counts into buckets, one bucket for each day.
    const groups = groupCountsByDay(counts, space);

    // Calculate space utilization using this grouped data.
    const utilizations = spaceUtilizationPerGroup(space, groups);

    this.setState({
      view: VISIBLE,

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
    // No data exists, so render a '-' instead of actual data.
    if (data.length === 0) {
      return null;
    }

    const utilizationSum = data.reduce((acc, i) => acc + i.averageUtilization, 0);
    const result = utilizationSum / data.length;
    return Math.round(result * 100) / 100; /* round to the nearest percentage */
  }

  componentWillReceiveProps({space, startDate, endDate, timeSegment, timeSegmentGroup}) {
    if (space && (
      space.id !== this.state.dataSpaceId ||
      space.capacity !== this.state.dataSpaceCapacity ||
      startDate !== this.state.startDate ||
      endDate !== this.state.endDate ||
      timeSegment.id !== this.state.timeSegment.id ||
      timeSegmentGroup.id !== this.state.timeSegmentGroup.id
    )) {
      this.setState({
        view: LOADING,
        startDate,
        endDate,
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
      startDate,
      endDate,
      timeSegment,
      timeSegmentGroup,
    } = this.state;

    let utilizationsByDay,
      averageUtilizationDatapoints,
      peakUtilizationPercentage,
      peakUtilizationTimestamp,
      averageUtilizationDatapointsWithTimestamp;

    const timeSegmentDurationInSeconds = parseTimeInTimeSegmentToSeconds(timeSegment.end) - parseTimeInTimeSegmentToSeconds(timeSegment.start);

    if (view === VISIBLE) {
      //

      // Calculate the average utilization for each day within the specified time segment.
      utilizationsByDay = this.state.data.reduce((acc, i) => {
        const dayOfWeek = parseDayAtSpace(i.date, space).day();
        acc[dayOfWeek].push(i);
        return acc;
      }, [[], [], [], [], [], [], []]);


      // Calculate an average day's utilization graph.
      averageUtilizationDatapoints = (this.state.data[0] ? this.state.data[0].utilization : []).map(_ => 0);

      // The average calculation is split into two parts: the sum and the division.
      // - The sum part of the average (step 1) occurs below.
      // - `dataPointCount` contains the number of samples that have been summed together and is the
      // number that will be divided by later to complete the average.
      let dataPointCount = 0;
      this.state.data.forEach(group => {
        if (Array.isArray(group.utilization)) {
          averageUtilizationDatapoints = averageUtilizationDatapoints.map(
            (i, ct) => i + (group.utilization[ct] || 0) /* ensure that a utilization bucket has data */
          )
          dataPointCount += 1;
        }
      });

      const initialTimestamp = parseISOTimeAtSpace(this.state.counts[0].timestamp, space)
        .startOf('day')
        .add(parseTimeInTimeSegmentToSeconds(timeSegment.start), 'seconds');

      averageUtilizationDatapointsWithTimestamp = averageUtilizationDatapoints
        .map(i => i / dataPointCount) /* second part of calculating average */
        .map(i => Math.round(i * 1000) / 1000) /* round each number to a single decimal place */
        .reduce(({timestamp, data}, i, ct) => {
          // Increment timestamp to get to the next sample's timestamp.
          timestamp = timestamp.add(timeSegmentDurationInSeconds / averageUtilizationDatapoints.length, 'seconds')

          return {
            timestamp,
            data: [
              ...data,
              { timestamp: timestamp.format(), value: i * 100 },
            ],
          };
        }, {timestamp: initialTimestamp, data: []}).data;

      // Calculate the peak utilization of the space by getting the peak count within the raw count
      // data that was fetched and dividing it by the capacity.
      peakUtilizationPercentage = 0;
      peakUtilizationTimestamp = null; /* No peak utilization */
      averageUtilizationDatapointsWithTimestamp.forEach((c, index) => {
        if (c.value > peakUtilizationPercentage) {
          peakUtilizationPercentage = c.value;
          peakUtilizationTimestamp = c.timestamp;
        }
      });
      peakUtilizationPercentage /= 100;
    }

    const averageWeekHeader = (
      <CardHeader>
        An Average Week
        <InfoPopup horizontalIconOffset={8}>
          <p className="insights-space-detail-utilization-card-popup-p">
            Utilization for time segment <strong>{timeSegmentGroup.name}</strong> over the
            time period of <strong>{parseISOTimeAtSpace(startDate, space).format('MM/DD/YYYY')}</strong> -{' '}
            <strong>{parseISOTimeAtSpace(endDate, space).format('MM/DD/YYYY')}</strong>, grouped and averaged
            by day of week.
          </p>

          <p className="insights-space-detail-utilization-card-popup-p">
            Use this metric to understand your space's average utilization, as well as how
            utilization varies from day to day. 
          </p>

          <p className="insights-space-detail-utilization-card-popup-p">
            Utilization is calculated by dividing visitors by space capacity (with a granularity
            of 10 minute intervals). Does not include incomplete days of data.
          </p>
        </InfoPopup>
        <span
          className={classnames('insights-space-detail-utilization-card-header-refresh', {
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
    );

    const averageDayHeader = (
      <CardHeader>
        An Average Day
        <InfoPopup horizontalIconOffset={8}>
          <p className="insights-space-detail-utilization-card-popup-p">
            An average daily breakdown of utilization for
            time segment <strong>{timeSegmentGroup.name}</strong> over the time period
            of <strong>{parseISOTimeAtSpace(startDate, space).format('MM/DD/YYYY')}</strong>
            {' - '}
            <strong>{parseISOTimeAtSpace(endDate, space).format('MM/DD/YYYY')}</strong>.
          </p>

          <p className="insights-space-detail-utilization-card-popup-p">
            Use this to understand average peak and trends in utilization over the course of a
            day. 
          </p>

          <p className="insights-space-detail-utilization-card-popup-p">
            Utilization is calculated by dividing visitors by the space's capacity (with a
            granularity of 10 minute intervals). Utilization is then averaged across all days
            within the date range. Does not include incomplete days of data.
          </p>
        </InfoPopup>
        <span
          className={classnames('insights-space-detail-utilization-card-header-refresh', {
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
    );

    let body;
    switch (this.state.view) {
      case LOADING:
        body = (
          <span>
            {(() => {
              if (getDurationBetweenMomentsInDays(this.state.startDate, this.state.endDate) > 14) {
                return 'Generating Data (this may take a while ... )'
              } else {
                return 'Generating Data . . .';
              }
            })()}
          </span>
        );

        return (
          <div>
            <Card className="insights-space-detail-utilization-card-average-week">
              <CardLoading indeterminate />
              {averageWeekHeader}
              <div className="insights-space-detail-utilization-card-body-info" style={{height: 514}}>
                {body}
              </div>
            </Card>
            <Card className="insights-space-detail-utilization-card-average-day">
              <CardLoading indeterminate />
              {averageDayHeader}
              <div className="insights-space-detail-utilization-card-body-info" style={{height: 624}}>
                {body}
              </div>
            </Card>
          </div>
        );

      case REQUIRES_CAPACITY:
        body = (
          <div className="insights-space-detail-utilization-card-body-info">
            <span>No capacity is set for this space. Capacity is required to calculate utilization.</span>
          </div>
        );

        return (
          <div>
            <Card className="insights-space-detail-utilization-card-average-week">
              {averageWeekHeader}
              {body}
            </Card>
            <Card className="insights-space-detail-utilization-card-average-day">
              {averageDayHeader}
              {body}
            </Card>
          </div>
        );

      case EMPTY:
        body = (
          <div className="insights-space-detail-utilization-card-body-info">
            <span>No data found in date range.</span>
          </div>
        );

        return <div>
          <Card className="insights-space-detail-utilization-card-average-week">
            {averageWeekHeader}
            {body}
          </Card>
          <Card className="insights-space-detail-utilization-card-average-day">
            {averageDayHeader}
            {body}
          </Card>
        </div>;

      case ERROR:
        body = (
          <div className="insights-space-detail-utilization-card-body-info">
            <span>
              <span className="insights-space-detail-utilization-card-body-error-icon">&#xe91a;</span>
              {this.state.error}
            </span>
          </div>
        );

        return <div>
          <Card className="insights-space-detail-utilization-card-average-week">
            {averageWeekHeader}
            {body}
          </Card>
          <Card className="insights-space-detail-utilization-card-average-day">
            {averageDayHeader}
            {body}
          </Card>
        </div>;

      case VISIBLE:
        return (
          <div>
            <Card className="insights-space-detail-utilization-card-average-week">
              {averageWeekHeader}
              <CardWell type="dark">
                Average utilization of <CardWellHighlight>
                  {Math.round(this.calculateAverageUtilization() * 100)}%
                </CardWellHighlight> during <CardWellHighlight>
                  {timeSegmentGroup.name}
                </CardWellHighlight>
              </CardWell>
              <CardBody className="insights-space-detail-utilization-card-average-weekly-breakdown">
                <div className="insights-space-detail-utilization-card-grid-header">
                  <div className="insights-space-detail-utilization-card-grid-item">Day</div>
                  <div className="insights-space-detail-utilization-card-grid-item">Average Utilization</div>
                </div>
                {timeSegment.days.map(day => {
                  const index = DAY_TO_INDEX_IN_UTILIZAITIONS_BY_DAY[day];
                  return <div className="insights-space-detail-utilization-card-grid-row" key={day}>
                    <div className="insights-space-detail-utilization-card-grid-item">{day}</div>
                    <div className="insights-space-detail-utilization-card-grid-item">
                      <PercentageBar
                        percentage={this.calculateAverageUtilization(utilizationsByDay[index])}
                        percentageFormatter={percentage => percentage !== null ? `${formatPercentage(percentage, 0)}%` : null}
                        breakWidth={AVERAGE_WEEKLY_BREAKDOWN_PERCENTAGE_BAR_BREAK_WIDTH_IN_PX}
                      />
                    </div>
                  </div>;
                })}
              </CardBody>
            </Card>
            <Card className="insights-space-detail-utilization-card-average-day">
              {averageDayHeader}
              <CardWell type="dark">
                {peakUtilizationTimestamp === null ? <span>
                  <CardWellHighlight>
                    No peak utilization
                    </CardWellHighlight> during <CardWellHighlight>
                    {timeSegmentGroup.name}
                  </CardWellHighlight>
                  </span> : <span>
                  Most busy around <CardWellHighlight>
                    {(timestamp => {
                      let stamp = parseISOTimeAtSpace(timestamp, space);
                      let minute = '00';
                      const stampMinute = stamp.minute();

                      if (stampMinute > (45 + 7.5)) {
                        minute = '00';
                        stamp = stamp.add(1, 'hour');
                      } else if (stampMinute > (45 - 7.5) && stampMinute <= (45 + 7.5)) {
                        minute = '45';
                      } else if (stampMinute > (30 - 7.5) && stampMinute <= (30 + 7.5)) {
                        minute = '30';
                      } else if (stampMinute > (15 - 7.5) && stampMinute <= (15 + 7.5)) {
                        minute = '15';
                      } else {
                        minute = '30';
                      }

                      return stamp.format(`h:[${minute}]a`).slice(0, -1);
                    })(peakUtilizationTimestamp)}
                  </CardWellHighlight> &mdash; around <CardWellHighlight>
                    {Math.round(peakUtilizationPercentage * space.capacity)} people
                  </CardWellHighlight> ({Math.round(peakUtilizationPercentage * 100)}% utilization)
                </span>}
              </CardWell>

              <div className="insights-space-detail-utilization-card-daily-breakdown-chart">
                <LineChartComponent
                  timeZone={space.timeZone}
                  svgWidth={965}
                  svgHeight={350}

                  xAxis={xAxisDailyTick({
                    formatter: (n) => {
                      // "5a" or "8p"
                      const timeFormat = parseISOTimeAtSpace(n, space).format('hA');
                      return timeFormat.slice(0, timeFormat.startsWith('12') ? -1 : -2).toLowerCase();
                    },
                  })}

                  yAxis={yAxisMinMax({
                    leftOffset: 10,
                    points: [
                      {value: 100, hasRule: true},
                    ],
                    showMaximumPoint: false,
                    formatter: ({value}) => value === 100 ? '100%' : `${value}`,
                  })}
                  yAxisStart={0}

                  // The largest point on the y axis should either be:
                  // 1. The largest point on the graph, if larger than 100. (+ 10% in spacing)
                  // 2. 100.
                  yAxisEnd={Math.max(
                    Math.max.apply(Math, averageUtilizationDatapointsWithTimestamp.map(i => i.value))+10, /* 1 */
                    100 /* 2 */
                  )}

                  overlays={[
                    overlayTwoPopups({
                      topPopupFormatter: overlayTwoPopupsPlainTextFormatter(item => `Utilization: ${Math.round(item.value)}%`, 'top'),
                      bottomPopupFormatter: overlayTwoPopupsPlainTextFormatter(
                        (item, {mouseX, xScale}) => {
                          const timestamp = parseISOTimeAtSpace(xScale.invert(mouseX), space);
                          const time = formatTimeSegmentBoundaryTimeForHumans(timestamp);
                          return `Avg. Weekday at ${time}`;
                        }
                      ),

                      bottomOverlayTopMargin: 40,
                      topOverlayBottomMargin: 10,

                      topOverlayWidth: 150,
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
                      data: averageUtilizationDatapointsWithTimestamp.sort(
                        (a, b) => moment.utc(a.timestamp).valueOf() - moment.utc(b.timestamp).valueOf()
                      ),
                    },
                  ]}
                />
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  }
}
