import * as React from 'react';
import classnames from 'classnames';

import moment from 'moment';
import 'moment-timezone';

import { core } from '@density-int/client';
import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';

import Card, { CardHeader, CardBody, CardLoading } from '@density/ui-card';

import DateRangePicker, { ANCHOR_RIGHT } from '@density/ui-date-range-picker';
import { isInclusivelyBeforeDay } from '@density/react-dates';

import RawEventsPager from '../visualization-space-detail-raw-events-pager/index';

function getDifferenceBetweenDates(a, b) {
  const diff = moment.utc(a).valueOf() - moment.utc(b).valueOf();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
  const minutes = Math.floor(diff / (60 * 1000)) - (hours * 60);
  const seconds = Math.floor(diff / 1000) - (minutes * 60);

  let total = '';
  if (days) { total += `${days}d `; }
  if (hours) { total += `${hours}h `; }
  if (minutes) { total += `${minutes}m `; }
  if (seconds) { total += `${seconds}s `; }

  return total;
}

const LOADING = 'LOADING',
      EMPTY = 'EMPTY',
      VISIBLE = 'VISIBLE',
      ERROR = 'ERROR';

export default class VisualizationSpaceDetailRawEventsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: LOADING,

      data: null,
      nextPageAvailable: false,
      previousPageAvailable: false,
      page: 1,
      pageSize: 20,
      total: 0,
      error: null,

      dataSpaceId: null,
      datePickerInput: null,

      // A lookup table for doorway information that is moslty used to display the doorway name in
      // the raw events list.
      doorwayLookup: {},

      startDate: moment.utc().subtract(6, 'days').format(),
      endDate: moment.utc().format(),
    };
  }
  fetchData() {
    const {space} = this.props;

    // Add timezone offset to both start and end times prior to querying for the count.
    const startTime = moment.utc(this.state.startDate).tz(space.timeZone).startOf('day');
    const endTime = moment.utc(this.state.endDate).tz(space.timeZone).startOf('day');

    return core.spaces.events({
      id: space.id,
      start_time: startTime.format(),
      end_time: endTime.format(),
      page: this.state.page,
      page_size: this.state.pageSize,
    }).then(preData => {
      // No results returned? Transition to EMPTY state.
      if (preData.results.length === 0) {
        this.setState({
          state: EMPTY,
          dataSpaceId: space.id,

          data: null,
          nextPageAvailable: false,
          previousPageAvailable: false,
        });
        return
      }

      // Convert all keys in the response to camelcase. Also, reverse data so it is ordered from
      const data = preData.results
        .map(i => objectSnakeToCamel(i))
        .sort((a, b) => moment.utc(a.timestamp).valueOf() - moment.utc(b.timestamp).valueOf());

      // Calculate a unique array of all doorways that are referenced by each event that was
      // returned.
      const uniqueArrayOfDoorways = data.reduce((acc, item) => {
        if (acc.indexOf(item.doorwayId) === -1) {
          return [...acc, item.doorwayId];
        } else {
          return acc;
        }
      }, []);

      // Fetch information about each doorway in each event, if the doorway information isn't
      // already known.
      const doorwayResponses = uniqueArrayOfDoorways.map(doorwayId => {
        if (!this.state.doorwayLookup[doorwayId]) {
          return core.doorways.get({id: doorwayId});
        } else {
          return false;
        }
      });

      return Promise.all(doorwayResponses).then(doorwayResponses => {
        // Add all the new doorways to the state.
        const doorwayLookup = this.state.doorwayLookup;
        uniqueArrayOfDoorways.forEach((id, index) => {
          doorwayLookup[id] = doorwayResponses[index];
        });

        // Update the state to reflect that the data fetching is complete.
        this.setState({
          state: VISIBLE,

          data,
          total: preData.total,
          nextPageAvailable: Boolean(preData.next),
          previousPageAvailable: Boolean(preData.previous),

          dataSpaceId: space.id,

          doorwayLookup,
        });
      });
    }).catch(error => {
      this.setState({
        state: ERROR,
        error: error.toString(),
        data: null,
        nextPageAvailable: false,
        previousPageAvailable: false,
      });
    });
  }
  render() {
    const {space} = this.props;
    if (space && space.id !== this.state.dataSpaceId) {
      this.fetchData.call(this);
    }

    return <div>
      <Card className="visualization-space-detail-card">
        {this.state.state === LOADING ? <CardLoading indeterminate /> : null}
        <CardHeader className="visualization-space-detail-raw-event-card-header">
          <span className="visualization-space-detail-raw-events-card-header-label">
            Raw Events
            <span
              className="visualization-space-detail-raw-events-card-header-refresh"
              onClick={() => this.setState({
                state: LOADING,
                data: null,
                page: 1,
              }, () => this.fetchData.call(this))}
            />
          </span>

          {/* Download a CSV for that contains the given raw events in the data range */}
          <span className={classnames('visualization-space-detail-raw-events-card-csv-download', {
            disabled: this.state.state === EMPTY,
          })}>CSV Download</span>

          {/* Select the date range for the data to display */}
          <div className="visualization-space-detail-raw-events-card-date-picker">
            <DateRangePicker
              startDate={moment.utc(this.state.startDate).tz(space.timeZone).startOf('day')}
              endDate={moment.utc(this.state.endDate).tz(space.timeZone).startOf('day')}
              onChange={({startDate, endDate}) => {
                // Update the start and end date with the values selected.
                this.setState({
                  startDate: startDate ? startDate.format() : undefined,
                  endDate: endDate ? endDate.format() : undefined,
                }, () => {
                  // If the start date and end date were both set, then load data.
                  if (this.state.startDate && this.state.endDate) {
                    this.setState({ state: LOADING, data: null, page: 1}, () => {
                      this.fetchData();
                    });
                  }
                });
              }}
              focusedInput={this.state.datePickerInput}
              onFocusChange={focused => this.setState({datePickerInput: focused})}
              anchor={ANCHOR_RIGHT}
              isOutsideRange={day => !isInclusivelyBeforeDay(day, moment.utc())}
            />
          </div>
        </CardHeader>

        {this.state.state === VISIBLE ? <div>
          <CardBody className="visualization-space-detail-raw-events-card-table-row header">
            <li>Timestamp</li>
            <li>Event</li>
            <li>Doorway</li>
            <li>Previous Event</li>
          </CardBody>

          {this.state.data.map((item, ct) => {
            let lastItem = ct > 0 ? this.state.data[ct - 1] : null;
            return <CardBody key={item.id} className="visualization-space-detail-raw-events-card-table-row">
              <li>{item.timestamp}</li>
              <li>{item.direction === 1 ? 'Ingress' : 'Egress'}</li>
              <li>{this.state.doorwayLookup[item.doorwayId] ? this.state.doorwayLookup[item.doorwayId].name : item.doorwayId}</li>
              <li>{lastItem ? `${getDifferenceBetweenDates(item.timestamp, lastItem.timestamp)} ago` : 'N/A'}</li>
            </CardBody>;
          })}
        </div> : null}

        {this.state.state === EMPTY ? <div className="visualization-space-detail-raw-events-card-body-info">
          No data available for this time period.
        </div> : null}
        {this.state.state === LOADING ? <div className="visualization-space-detail-raw-events-card-body-info">
          Fetching events...
        </div> : null}
        {this.state.state === ERROR ? <div className="visualization-space-detail-raw-events-card-body-error">
          <span>
            <span className="visualization-space-detail-raw-events-card-body-error-icon">&#xe91a;</span>
            {this.state.error}
          </span>
        </div> : null}
      </Card>

      <RawEventsPager
        disabled={this.state.state !== VISIBLE}
        page={this.state.page}
        totalPages={Math.ceil(this.state.total / this.state.pageSize)}
        totalEvents={this.state.total}
        onChange={page => {
          this.setState({state: LOADING, data: null, page}, () => this.fetchData());
        }}
      />
    </div>;
  }
}
