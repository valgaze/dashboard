import * as React from 'react';
import classnames from 'classnames';

import moment from 'moment';
import 'moment-timezone';

import { core } from '../../client';
import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';

import Card, { CardHeader, CardBody, CardLoading } from '@density/ui-card';

import DateRangePicker, { ANCHOR_RIGHT, ANCHOR_LEFT } from '@density/ui-date-range-picker';
import { isInclusivelyBeforeDay } from '@density/react-dates';

import commonRanges from '../../helpers/common-ranges';

import gridVariables from '@density/ui/variables/grid.json'

import RawEventsPager from '../visualization-space-detail-raw-events-pager/index';

export const LOADING = 'LOADING',
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

      // By default, csv isn't downloading.
      // Later, it's used as a lock to lock the downloading functionality when the download is
      // already pending.
      currentlyDownloadingCsv: false,

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
    const endTime = moment.utc(this.state.endDate).tz(space.timeZone).endOf('day');

    return core.spaces.events({
      id: space.id,
      start_time: startTime.format(),
      end_time: endTime.format(),
      page: this.state.page,
      page_size: this.state.pageSize,
      order: 'desc',
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
      const doorwayResponses = uniqueArrayOfDoorways.map(doorwayId => {
        if (this.state.doorwayLookup[doorwayId]) {
          return this.state.doorwayLookup[doorwayId];
        } else {
          return core.doorways.get({id: doorwayId});
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

  // updates the state's `startDate` and `endDate` and triggers a `fetchData`
  setDatesAndFetchData(startDate, endDate) {
    this.setState({
      startDate: startDate ? startDate.format() : undefined,
      endDate: endDate ? endDate.format() : undefined,
    }, () => {
      // If the start date and end date were both set, then load data.
      if (this.state.startDate && this.state.endDate) {
        this.setState({ state: LOADING, data: null, page: 1 }, () => {
          this.fetchData();
        });
      }
    });
  }

  // If there are events to download, download a csv containing all the events displayed to the
  // user's system.
  downloadCsv() {
    if (this.state.state !== EMPTY && this.state.currentlyDownloadingCsv === false) {
      // Show the download spinner
      this.setState({currentlyDownloadingCsv: true});

      return fetch(
        `https://api.density.io/v1/csv/?space_id=${this.props.space.id}&start_time=${this.state.startDate}&end_time=${this.state.endDate}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.sessionToken)}`
          },
        }
      ).then(response => response.text()).then(csv => {

        // This is a workaround to allow a user to download this csv data, or if that doesn't work,
        // then at least open it in a new tab for them to view and copy to the clipboard.
        // 1. Create a new blob url.
        // 2. Redirect the user to it in a new tab.
        const data = new Blob([csv], {type: 'text/csv'});
        const csvURL = URL.createObjectURL(data);

        // Hide the download spinner once csv has been downloaded and blob url has been created.
        this.setState({currentlyDownloadingCsv: false});

        const tempLink = document.createElement('a');
        document.body.appendChild(tempLink);
        tempLink.href = csvURL;
        tempLink.setAttribute('download', `${this.props.space.id}: ${this.state.startDate} - ${this.state.endDate}.csv`);
        tempLink.click();
      }).catch(error => {
        // When something goes wrong, update the state of the card.
        this.setState({
          currentlyDownloadingCsv: false,
          state: ERROR,
          error: `Error downloading CSV: ${error.message}`,
        });
      })
    }
  }

  render() {
    const {space} = this.props;
    if (space && space.id !== this.state.dataSpaceId) {
      this.fetchData.call(this);
    }

    return <div>
      <Card className="visualization-space-detail-raw-events-card">
        {this.state.state === LOADING || this.state.currentlyDownloadingCsv ? <CardLoading indeterminate /> : null}
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
          <span
            className={classnames('visualization-space-detail-raw-events-card-csv-download', {
              disabled: this.state.state === EMPTY || this.state.state === LOADING || this.state.currentlyDownloadingCsv,
            })}
            onClick={this.downloadCsv.bind(this)}
          >{this.state.currentlyDownloadingCsv ? 'CSV Downloading...' : 'CSV Download'}</span>

          {/* Select the date range for the data to display */}
          <div className="visualization-space-detail-raw-events-card-date-picker">
            <DateRangePicker
              startDate={moment.utc(this.state.startDate).tz(space.timeZone).startOf('day')}
              endDate={moment.utc(this.state.endDate).tz(space.timeZone).endOf('day')}
              onChange={({startDate, endDate}) => {
                this.setDatesAndFetchData(startDate, endDate);
              }}
              focusedInput={this.state.datePickerInput}
              onFocusChange={focused => this.setState({datePickerInput: focused})}

              // On mobile, make the calendar one month wide and left aligned.
              // On desktop, the calendar is two months wide and right aligned.
              anchor={document.body && document.body.clientWidth > gridVariables.screenSmMin ? ANCHOR_RIGHT : ANCHOR_LEFT}
              numberOfMonths={document.body && document.body.clientWidth > gridVariables.screenSmMin ? 2 : 1}

              isOutsideRange={day => !isInclusivelyBeforeDay(day, moment.utc())}

              // common ranges functionality
              commonRanges={commonRanges}
              onSelectCommonRange={(r) => this.setDatesAndFetchData(r.startDate, r.endDate)}
              // showCommonRangeSubtitles={true}
            />
          </div>
        </CardHeader>

        {this.state.state === VISIBLE ? <div className="visualization-space-detail-raw-events-card-table">
          <CardBody className="visualization-space-detail-raw-events-card-table-row header">
            <li>Timestamp</li>
            <li>Event</li>
            <li>Doorway</li>
          </CardBody>

          {this.state.data.map((item, ct) => {
            return <CardBody key={item.id} className="visualization-space-detail-raw-events-card-table-row">
              <li>{moment.utc(item.timestamp).tz(space.timeZone).format('MMM Do YYYY, h:mm:ss a')}</li>
              <li>{item.direction === 1 ? 'Entrance' : 'Exit'}</li>
              <li>{this.state.doorwayLookup[item.doorwayId] ? this.state.doorwayLookup[item.doorwayId].name : item.doorwayId}</li>
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
