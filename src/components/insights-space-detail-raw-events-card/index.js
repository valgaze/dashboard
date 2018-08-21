import React from 'react';
import classnames from 'classnames';

import moment from 'moment';
import 'moment-timezone';

import { core } from '../../client';
import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';
import { TIME_SEGMENTS } from '../../helpers/space-utilization/index';

import Card, { CardHeader, CardBody, CardLoading } from '@density/ui-card';
import { IconRefresh } from '@density/ui-icons';

import RawEventsPager from '../insights-space-detail-raw-events-pager/index';

export const LOADING = 'LOADING',
      EMPTY = 'EMPTY',
      VISIBLE = 'VISIBLE',
      ERROR = 'ERROR';

export default class VisualizationSpaceDetailRawEventsCard extends React.Component {
  state = {
    view: LOADING,

    data: null,
    nextPageAvailable: false,
    previousPageAvailable: false,
    page: 1,
    pageSize: 20,
    total: 0,
    error: null,

    dataSpaceId: null,
    datePickerInput: null,

    date: null,
    timeSegmentId: null,

    // A lookup table for doorway information that is mostly used to display the doorway name in
    // the raw events list.
    doorwayLookup: {},
  }

  fetchData = async () => {
    const { space } = this.props;
    const { date, page, pageSize, doorwayLookup, timeSegmentId } = this.state;

    // Add timezone offset to both start and end times prior to querying for the count.
    const day = moment.utc(date).tz(space.timeZone);

    try {
      const preData = await core.spaces.events({
        id: space.id,
        start_time: day.startOf('day').add(TIME_SEGMENTS[timeSegmentId].start, 'hours').format(),
        end_time: day.startOf('day').add(TIME_SEGMENTS[timeSegmentId].end, 'hours').format(),
        page: page,
        page_size: pageSize,
        order: 'desc',
      });

      // No results returned? Transition to EMPTY state.
      if (preData.results.length === 0) {
        this.setState({
          view: EMPTY,
          dataSpaceId: space.id,

          data: null,
          nextPageAvailable: false,
          previousPageAvailable: false,
        });
        return;
      }

      // Convert all keys in the response to camelcase. Also, reverse data so it is ordered from
      const data = preData.results
        .map(i => objectSnakeToCamel(i))
        .sort((a, b) => moment.utc(b.timestamp).valueOf() - moment.utc(a.timestamp).valueOf());

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
      const doorwayRequests = uniqueArrayOfDoorways.map(doorwayId => {
        if (doorwayLookup[doorwayId]) {
          return doorwayLookup[doorwayId];
        } else {
          return core.doorways.get({id: doorwayId});
        }
      });

      const doorwayResponses = await Promise.all(doorwayRequests);

      // Add all the new doorways to the state.
      uniqueArrayOfDoorways.forEach((id, index) => {
        doorwayLookup[id] = doorwayResponses[index];
      });

      // Update the state to reflect that the data fetching is complete.
      this.setState({
        view: VISIBLE,

        data,
        total: preData.total,
        nextPageAvailable: Boolean(preData.next),
        previousPageAvailable: Boolean(preData.previous),

        dataSpaceId: space.id,

        doorwayLookup,
      });
    } catch (error) {
      this.setState({
        view: ERROR,
        error,
        data: null,
        nextPageAvailable: false,
        previousPageAvailable: false,
      });
    }
  }

  componentWillReceiveProps({space, date, timeSegmentId}) {
    if (space && (
      space.id !== this.state.dataSpaceId ||
      date !== this.state.date ||
      timeSegmentId !== this.state.timeSegmentId
    )) {
      this.setState({
        view: LOADING,
        date,
        timeSegmentId,
      }, () => this.fetchData());
    }
  }

  render() {
    const { space } = this.props;
    const {
      view,
      data,
      error,
      doorwayLookup,
      page,
      total,
      pageSize,
    } = this.state;

    return <div>
      <Card className="insights-space-detail-raw-events-card">
        {view === LOADING ? <CardLoading indeterminate /> : null}
        <CardHeader className="insights-space-detail-raw-event-card-header">
          <span className="insights-space-detail-raw-events-card-header-label">Daily Raw Events</span>
          <span
            className={classnames('insights-space-detail-raw-events-card-header-refresh', {
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

        {view === VISIBLE ? <div className="insights-space-detail-raw-events-card-table">
          <CardBody className="insights-space-detail-raw-events-card-table-row header">
            <li>Timestamp</li>
            <li>Event</li>
            <li>Doorway</li>
          </CardBody>

          {data.map((item, ct) => {
            return <CardBody key={item.id} className="insights-space-detail-raw-events-card-table-row">
              <li>{moment.utc(item.timestamp).tz(space.timeZone).format('MMM Do YYYY, h:mm:ss a')}</li>
              <li>{item.direction === 1 ? 'Entrance' : 'Exit'}</li>
              <li>{doorwayLookup[item.doorwayId] ? doorwayLookup[item.doorwayId].name : item.doorwayId}</li>
            </CardBody>;
          })}
        </div> : null}

        {view === EMPTY ? <div className="insights-space-detail-raw-events-card-body-info">
          No data available for this time period.
        </div> : null}
        {view === LOADING ? <div className="insights-space-detail-raw-events-card-body-info">
          Fetching events...
        </div> : null}
        {view === ERROR ? <div className="insights-space-detail-raw-events-card-body-error">
          <span>
            <span className="insights-space-detail-raw-events-card-body-error-icon">&#xe91a;</span>
            {error.toString()}
          </span>
        </div> : null}
      </Card>

      <RawEventsPager
        disabled={view !== VISIBLE}
        page={page}
        totalPages={Math.ceil(total / pageSize)}
        totalEvents={total}
        onChange={page => {
          this.setState({view: LOADING, data: null, page}, () => this.fetchData());
        }}
      />
    </div>;
  }
}
