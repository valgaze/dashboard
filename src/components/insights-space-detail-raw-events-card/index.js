import React from 'react';
import classnames from 'classnames';

import moment from 'moment';
import 'moment-timezone';

import { core } from '../../client';
import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';

import Card, { CardHeader, CardLoading, CardTable } from '@density/ui-card';
import { IconRefresh } from '@density/ui-icons';
import InfoPopup from '@density/ui-info-popup';

import RawEventsPager from '../insights-space-detail-raw-events-pager/index';

import {
  DEFAULT_TIME_SEGMENT_GROUP,
  DEFAULT_TIME_SEGMENT,
} from '../../helpers/time-segments/index';

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
    timeSegmentGroup: DEFAULT_TIME_SEGMENT_GROUP,
    timeSegment: DEFAULT_TIME_SEGMENT,

    // A lookup table for doorway information that is mostly used to display the doorway name in
    // the raw events list.
    doorwayLookup: {},
  }

  fetchData = async () => {
    const { space } = this.props;
    const { date, page, pageSize, doorwayLookup, timeSegmentGroup } = this.state;

    // Add timezone offset to both start and end times prior to querying for the count.
    const day = moment.utc(date).tz(space.timeZone);

    try {
      const preData = await core.spaces.events({
        id: space.id,
        start_time: day.startOf('day').format(),
        end_time: day.endOf('day').format(),
        time_segment_groups: timeSegmentGroup.id === DEFAULT_TIME_SEGMENT_GROUP.id ? '' : timeSegmentGroup.id,
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

  componentWillReceiveProps({space, date, timeSegment, timeSegmentGroup}) {
    if (space && (
      space.id !== this.state.dataSpaceId ||
      date !== this.state.date ||
      timeSegment.id !== this.state.timeSegment.id ||
      timeSegmentGroup.id !== this.state.timeSegmentGroup.id
    )) {
      this.setState({
        view: LOADING,
        date,
        timeSegment,
        timeSegmentGroup,
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
      date,
      timeSegmentGroup,
    } = this.state;

    return <div>
      <Card className="insights-space-detail-raw-events-card">
        {view === LOADING ? <CardLoading indeterminate /> : null}
        <CardHeader>
          Daily Raw Events
          <InfoPopup horizontalIconOffset={8}>
            <p>
              All events that the doorways within this space have seen over{' '}
              {moment.utc(date).tz(space.timeZone).format('MM/DD/YYYY')} during{' '}
              {timeSegmentGroup.name}.
            </p>

            <p>
              Head to the <a href={`#/spaces/insights/${space.id}/data-export`}>data export</a> page
              to download multiple days worth of event data in csv format.
            </p>
          </InfoPopup>
          <span
            className={classnames('insights-space-detail-raw-events-card-header-refresh', {
              disabled: !(view === VISIBLE || view === EMPTY),
            })}
            onClick={() => this.setState({
              view: LOADING,
              data: null,
            }, () => this.fetchData())}
          >
            <IconRefresh color={view === LOADING ? 'gray' : 'primary'} />
          </span>
        </CardHeader>

        {view === VISIBLE ? <CardTable
          headings={["Timestamp", "Event", "Doorway"]}
          data={data}
          mapDataItemToRow={item => [
            moment.utc(item.timestamp).tz(space.timeZone).format('MMM Do YYYY, h:mm:ss a'),
            item.direction === 1 ? 'Entrance' : 'Exit',
            doorwayLookup[item.doorwayId] ? doorwayLookup[item.doorwayId].name : item.doorwayId,
          ]}
        /> : null}

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
