import * as React from 'react';

import moment from 'moment';
import 'moment-timezone';

import Card, { CardHeader, CardBody, CardLoading } from '@density/ui-card';
import { core } from '@density-int/client';
import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';

import DateRangePicker, { ANCHOR_RIGHT } from '@density/ui-date-range-picker';
import { isInclusivelyBeforeDay } from '@density/react-dates';

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
      // Convert all keys in the response to camelcase. Also, reverse data so it is ordered from
      const data = preData.results
        .map(i => objectSnakeToCamel(i))
        // .sort((a, b) => moment.utc(a.timestamp).diff(moment.utc(b.timestamp)) ? 1 : -1);
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

      return Promise.all([preData, data, uniqueArrayOfDoorways, Promise.all(doorwayResponses)]);
    }).then(([preData, data, uniqueArrayOfDoorways, doorwayResponses]) => {
      // Add all the new doorways to the state.
      const doorwayLookup = this.state.doorwayLookup;
      uniqueArrayOfDoorways.forEach((id, index) => {
        doorwayLookup[id] = doorwayResponses[index];
      });

      // Update the state to reflect that the data fetching is complete.
      this.setState({
        state: VISIBLE,

        data,
        nextPageAvailable: Boolean(preData.next),
        previousPageAvailable: Boolean(preData.previous),

        dataSpaceId: space.id,

        doorwayLookup,
      });
    }).catch(error => {
      this.setState({
        state: ERROR,
        error,
        data: null,
        nextPageAvailable: false,
        previousPageAvailable: false,
      });
    })
  }
  render() {
    const {space} = this.props;
    if (space && space.id !== this.state.dataSpaceId) {
      this.fetchData.call(this);
    }

    return <Card className="visualization-space-detail-card">
      {this.state.state === LOADING ? <CardLoading indeterminate /> : null}
      <CardHeader className="visualization-space-detail-raw-event-card-header">
        <span className="visualization-space-detail-raw-events-card-header-label">Raw Events</span>
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
                  this.setState({ state: LOADING, data: null}, () => {
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
        <CardBody className="visualization-space-detail-card-table-row header">
          <li>Timestamp</li>
          <li>Event</li>
          <li>Doorway</li>
        </CardBody>

        {this.state.data.map(item => (
          <CardBody key={item.id} className="visualization-space-detail-card-table-row">
            <li>{item.timestamp}</li>
            <li>{item.direction === 1 ? 'Ingress' : 'Egress'}</li>
            <li>{this.state.doorwayLookup[item.doorwayId] ? this.state.doorwayLookup[item.doorwayId].name : item.doorwayId}</li>
          </CardBody>
        ))}
      </div> : null}

      {this.state.state === EMPTY ? <div className="visualization-space-detail-raw-events-card-body-placeholder">
        No data available for this time period.
      </div> : null}
      {this.state.state === ERROR ? <div className="visualization-space-detail-raw-events-card-body-placeholder">
        {this.state.error}
      </div> : null}
    </Card>
  }
}
