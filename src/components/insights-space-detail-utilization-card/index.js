import React from 'react';
import classnames from 'classnames';

import moment from 'moment';
import 'moment-timezone';

import { core } from '../../client';

import Card, { CardHeader, CardBody, CardLoading, CardWell, CardWellHighlight } from '@density/ui-card';
import { IconRefresh } from '@density/ui-icons';
import InfoPopup from '@density/ui-info-popup';

import PercentageBar from '@density/ui-percentage-bar';

import fetchAllPages from '../../helpers/fetch-all-pages/index';
import formatPercentage from '../../helpers/format-percentage/index';

import spaceUtilizationPerGroup, {
  groupCountsByDay,
  isWithinTimeSegment,
  TIME_SEGMENTS,
} from '../../helpers/space-utilization/index';

import lineChart, { dataWaterline } from '@density/chart-line-chart';
import { xAxisDailyTick, yAxisMinMax } from '@density/chart-line-chart/dist/axes';
import {
  overlayTwoPopups,
  overlayTwoPopupsPlainTextFormatter,
} from '@density/chart-line-chart/dist/overlays';

import { chartAsReactComponent } from '@density/charts';
const LineChartComponent = chartAsReactComponent(lineChart);

const AVERAGE_WEEKLY_BREAKDOWN_PERCENTAGE_BAR_BREAK_WIDTH_IN_PX = 320;

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
    timeSegmentId: null,
    includeWeekends: false,
  }

  fetchData = async () => {
    const { space } = this.props;

    if (!space.capacity) {
      this.setState({
        view: REQUIRES_CAPACITY,

        // Along with the utilization data, store the space id that the data has been calculated for.
        // In this way, if the space id changes, then we know to refetch utilization data.
        dataSpaceId: space.id,
      });
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
        }(this.state.timeSegmentId),

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
      if (this.state.includeWeekends) {
        return true; // Include all days
      } else {
        return dayOfWeek !== 5 && dayOfWeek !== 6; // Remove saturday and sunday
      }
    }).map(group => {
      // Remove all counts in each bucket that is outside each time segment.
      return {
        ...group,
        counts: group.counts.filter(count => {
          return isWithinTimeSegment(
            count.timestamp,
            space.timeZone,
            TIME_SEGMENTS[this.state.timeSegmentId]
          );
        }),
      };
    });

    // Calculate space utilization using this dat with un-important time segments removed.
    const utilizations = spaceUtilizationPerGroup(space, filteredGroups);

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

  componentWillReceiveProps({space, startDate, endDate, timeSegmentId, includeWeekends}) {
    if (space && (
      space.id !== this.state.dataSpaceId ||
      space.capacity !== this.state.dataSpaceCapacity ||
      startDate !== this.state.startDate ||
      endDate !== this.state.endDate ||
      timeSegmentId !== this.state.timeSegmentId ||
      includeWeekends !== this.state.includeWeekends
    )) {
      this.setState({
        view: LOADING,
        startDate,
        endDate,
        timeSegmentId,
        includeWeekends,
      }, () => this.fetchData());
    }
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  render() {
    const { space } = this.props;
    const { view, timeSegmentId, startDate, endDate } = this.state;

    let utilizationsByDay,
      peakUtilizationPercentage,
      peakUtilizationTimestamp,
      averageUtilizationDatapointsWithTimestamp;

    if (view === VISIBLE) {
      //

      // Calculate the average utilization for each day within the specified time segment.
      utilizationsByDay = this.state.data.reduce((acc, i) => {
        const dayOfWeek = moment.utc(i.date, 'YYYY-MM-DD').tz(space.timeZone).day();
        acc[dayOfWeek].push(i);
        return acc;
      }, [[], [], [], [], [], [], []]);


      // Calculate an average day's utilization graph.
      let averageUtilizationDatapoints = (this.state.data[0] ? this.state.data[0].utilization : []).map(_ => 0);

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

      const dataDuration = TIME_SEGMENTS[this.state.timeSegmentId].end - TIME_SEGMENTS[this.state.timeSegmentId].start;

      const initialTimestamp = moment.utc(this.state.counts[0].timestamp)
        .tz(space.timeZone)
        .startOf('day')
        .add(TIME_SEGMENTS[this.state.timeSegmentId].start, 'hours');

      averageUtilizationDatapointsWithTimestamp = averageUtilizationDatapoints
        .map(i => i / dataPointCount) /* second part of calculating average */
        .map(i => Math.round(i * 1000) / 1000) /* round each number to a single decimal place */
        .reduce(({timestamp, data}, i, ct) => {
          // Increment timestamp to get to the next sample's timestamp.
          timestamp = timestamp.add(dataDuration / averageUtilizationDatapoints.length, 'hours')

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
      averageUtilizationDatapointsWithTimestamp.forEach(c => {
        if (c.value > peakUtilizationPercentage) {
          peakUtilizationPercentage = c.value;
          peakUtilizationTimestamp = c.timestamp;
        }
      });
      peakUtilizationPercentage /= 100;
    }

    const averageWeekHeader = (
      <CardHeader>
        <div className="insights-space-detail-utilization-card-header-container">
          <span className="insights-space-detail-utilization-card-header-label">
            An Average Week
            <InfoPopup>
              <p>
                Utilization for {timeSegmentId ? TIME_SEGMENTS[timeSegmentId].phrasal : null} over the
                time period of {moment.utc(startDate).tz(space.timeZone).format('MM/DD/YYYY')} -{' '}
                {moment.utc(endDate).tz(space.timeZone).format('MM/DD/YYYY')}, grouped and averaged
                by day of week.
              </p>

              <p>
                Use this metric to understand your space's average utilization, as well as how
                utilization varies from day to day. 
              </p>

              <p>
                Utilization is calculated by dividing visitors by space capacity (with a granularity
                of 10 minute intervals). Does not include incomplete days of data.
              </p>
            </InfoPopup>
          </span>
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
        </div>
      </CardHeader>
    );

    const averageDayHeader = (
      <CardHeader>
        <div className="insights-space-detail-utilization-card-header-container">
          <span className="insights-space-detail-utilization-card-header-label">
            An Average Day
            <InfoPopup>
              <p>
                An average daily breakdown of utilization for {timeSegmentId ?
                  TIME_SEGMENTS[timeSegmentId].phrasal : null} over the time period of{' '}
                  {moment.utc(startDate).tz(space.timeZone).format('MM/DD/YYYY')} -{' '}
                  {moment.utc(endDate).tz(space.timeZone).format('MM/DD/YYYY')}.
              </p>

              <p>
                Use this to understand average peak and trends in utilization over the course of a
                day. 
              </p>

              <p>
                Utilization is calculated by dividing visitors by the space's capacity (with a
                granularity of 10 minute intervals). Utilization is then averaged across all days
                within the date range. Does not include incomplete days of data.
              </p>
            </InfoPopup>
          </span>
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
        </div>
      </CardHeader>
    );

    let body;
    switch (this.state.view) {
      case LOADING:
        body = (
          <span>
            {(() => {
              if (
                moment.duration(
                  moment.utc(this.state.endDate).diff(moment.utc(this.state.startDate))
                ).weeks() > 2
              ) {
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
                  {TIME_SEGMENTS[this.state.timeSegmentId].phrasal}
                </CardWellHighlight>
              </CardWell>
              <CardBody className="insights-space-detail-utilization-card-average-weekly-breakdown">
                <div className="insights-space-detail-utilization-card-grid-header">
                  <div className="insights-space-detail-utilization-card-grid-item">Day</div>
                  <div className="insights-space-detail-utilization-card-grid-item">Average Utilization</div>
                </div>
                {[
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  ...(this.state.includeWeekends ? ['Saturday', 'Sunday'] : []),
                ].map((day, index) => {
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
                    {TIME_SEGMENTS[this.state.timeSegmentId].phrasal}
                  </CardWellHighlight>
                  </span> : <span>
                  On average, peak utilization of <CardWellHighlight>
                    {Math.round(peakUtilizationPercentage * 100)}%
                    </CardWellHighlight> happens around <CardWellHighlight>
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

                      return stamp.tz(space.timeZone).format(`h:[${minute}]a`).slice(0, -1);
                    })(peakUtilizationTimestamp)}
                    </CardWellHighlight> during <CardWellHighlight>
                    {TIME_SEGMENTS[this.state.timeSegmentId].phrasal}
                  </CardWellHighlight>
                </span>}
              </CardWell>

              <CardHeader>
                <span className="insights-space-detail-utilization-card-header-label">
                  Average Daily Breakdown
                </span>
              </CardHeader>
              <div className="insights-space-detail-utilization-card-daily-breakdown-chart">
                <LineChartComponent
                  timeZone={space.timeZone}
                  svgWidth={965}
                  svgHeight={350}

                  xAxis={xAxisDailyTick({
                    formatter: (n) => {
                      // "5a" or "8p"
                      const timeFormat = moment.utc(n).tz(space.timeZone).format('hA');
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
                          const timestamp = moment.utc(xScale.invert(mouseX)).tz(space.timeZone);
                          const time = timestamp.format(`h:mma`).slice(0, -1);
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
