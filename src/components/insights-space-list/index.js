import * as React from 'react';
import { connect } from 'react-redux';
import ErrorBar from '../error-bar/index';
import SortableGridHeader, { SortableGridHeaderItem, SORT_ASC, SORT_DESC } from '../sortable-grid-header/index';

import { core } from '../../client';
import moment from 'moment';

import collectionSpacesFilter from '../../actions/collection/spaces/filter';
import collectionSpacesUpdate from '../../actions/collection/spaces/update';

import InputBox from '@density/ui-input-box';
import Card, { CardHeader, CardBody, CardLoading } from '@density/ui-card';
import SetCapacityModal from '../insights-set-capacity-modal/index';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';

import spaceUtilizationPerGroup, {
  groupCountsByDay,
  groupCountFilter,
  isWithinTimeSegment,
  TIME_SEGMENTS,
} from '../../helpers/space-utilization/index';
import fetchAllPages from '../../helpers/fetch-all-pages/index';
import commaFormatNumber from '../../helpers/comma-format-number/index';

import filterCollection from '../../helpers/filter-collection/index';
const spaceFilter = filterCollection({fields: ['name']});

// Used to store which colum is the active column in the table.
const COLUMN_SPACE_NAME = 'COLUMN_SPACE_NAME',
      COLUMN_UTILIZATION = 'COLUMN_UTILIZATION',
      COLUMN_CAPACITY = 'COLUMN_CAPACITY';

// By default, sort in decending order.
const DEFAULT_SORT_DIRECTION = SORT_DESC;

// How long should data be fetched when running utilization calculations?
const DATA_DURATION_WEEK = 'DATA_DURATION_WEEK',
      DATA_DURATION_MONTH = 'DATA_DURATION_MONTH';

const LOADING = 'LOADING',
      VISIBLE = 'VISIBLE',
      ERROR = 'ERROR';

export class InsightsSpaceList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: LOADING,
      error: null,

      spaceCounts: {},
      spaceUtilizations: {},

      // Start by sorting the space name column in an acending order.
      activeColumn: COLUMN_SPACE_NAME,
      columnSortOrder: DEFAULT_SORT_DIRECTION,

      timeSegment: 'WORKING_HOURS',
      dataDuration: DATA_DURATION_WEEK,
    };

    this.fetchDataLock = false;

    this.fetchData();
  }

  async fetchData(spaces=this.props.spaces) {
    if (!(spaces && Array.isArray(spaces.data))) {
      return
    }

    if (this.fetchDataLock) {
      return;
    }

    // Only allow one data fetching attempt to happen at once.
    this.fetchDataLock = true;

    try {
      const spacesToFetch = spaces.data
        // Remove all spaces that have already had their counts fetched.
        .filter(space => typeof this.state.spaceCounts[space.id] === 'undefined')

      // Bail early if there is no work to do.
      if (spacesToFetch.length === 0) {
        this.fetchDataLock = false;
        return
      }

      // Store if each space has a capacity and therefore can be used to calculate utilization.
      const canSpaceBeUsedToCalculateUtilization = spacesToFetch.reduce((acc, i) => ({...acc, [i.id]: i.capacity !== null}), {})

      // Fetch counts for each space.
      const requests = spacesToFetch.map(space => {
        // Get the last full week of data.
        let startTime,
            endTime = moment.utc().tz(space.timeZone).subtract(1, 'week').endOf('week').subtract(1, 'day').format();
        if (this.state.dataDuration === DATA_DURATION_WEEK) {
          startTime = moment.utc().tz(space.timeZone).startOf('week').subtract(1, 'week').add(1, 'day').format();
        } else {
          startTime = moment.utc().tz(space.timeZone).subtract(1, 'month').format();
        }

        // Get all counts within that last full week. Request as many pages as required.
        return fetchAllPages(page => {
          return core.spaces.counts({
            id: space.id,
            start_time: startTime,
            end_time: endTime,
            interval: '10m',

            page,
            page_size: 1000,
          });
        });
      });

      // Wait for reuquest promises to resolve
      const spaceCountsArray = (await Promise.all(requests))
      // Add a `timestampAsMoment` property which converts the timestamp into a moment. This is so
      // that this expensive step doesn't have to be performed on each component render in the
      // `.calculateTotalNumberOfEventsForSpaces` method.
      .map((counts, ct) => {
        return counts.map(count => {
          return {
            ...count,
            timestampAsMoment: moment.utc(count.timestamp, 'YYYY-MM-DDTHH:mm:ssZ').tz(spacesToFetch[ct].timeZone),
          };
        });
      });

      const spaceCounts = {
        ...this.state.spaceCounts,
        ...spaceCountsArray.reduce((acc, i, ct) => ({...acc, [spacesToFetch[ct].id]: i}), {}),
      };

      this.setState({
        view: VISIBLE,
        spaceCounts,
        spaceUtilizations: Object.keys(spaceCounts).reduce((acc, spaceId, ct) => {
          // If a space doesn't have a capacity, don't use it for calculating utilization.
          if (!canSpaceBeUsedToCalculateUtilization[spaceId]) { return acc; }

          const space = spaces.data.find(i => i.id === spaceId);
          const counts = spaceCounts[spaceId];

          const groups = groupCountsByDay(counts, space.timeZone);
          const filteredGroups = groupCountFilter(groups, count =>
            isWithinTimeSegment(count.timestamp, space.timeZone, TIME_SEGMENTS[this.state.timeSegment]));
          const result = spaceUtilizationPerGroup(space, filteredGroups);

          return {
            ...acc,
            [space.id]: result.reduce((acc, i) => acc + i.averageUtilization, 0) / result.length,
          };
        }, {}),
      });
    } catch (error) {
      // Something went wrong. Update the state of the component such that it shows the error in the
      // error bar.
      this.setState({view: ERROR, error: `Could not fetch space counts: ${error.message}`});
    }

    this.fetchDataLock = false;
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps.spaces);
  }

  calculateTotalNumberOfEventsForSpaces(spaces=this.state.spaces) {
    const spaceIds = spaces.map(i => i.id);
    const spaceTimeZones = spaces.reduce((acc, i) => ({...acc, [i.id]: i.timeZone}), {});

    let eventCount = 0;
    for (let id in this.state.spaceCounts) {
      if (spaceIds.indexOf(id) === -1) { continue }
      const counts = this.state.spaceCounts[id];
      eventCount += counts.filter(i => {
        return isWithinTimeSegment(i.timestampAsMoment, spaceTimeZones[id], TIME_SEGMENTS[this.state.timeSegment]);
      }).length;
    }

    return eventCount;
  }

  render() {
    const { spaces, activeModal, onSpaceSearch, onOpenModal, onCloseModal, onSetCapacity} = this.props;
    const filteredSpaces = spaceFilter(spaces.data, spaces.filters.search);

    const spaceUtilizations = this.state.spaceUtilizations;

    return <div className="insights-space-list">
      {/* Show errors in the spaces collection. */}
      <ErrorBar
        message={spaces.error || this.state.error}
        modalOpen={activeModal.name !== null}
      />


      {/* Modal that is used to let the user set the capacity of a space. Shown when the user clicks
      on a 'set capacity' link within a space row if the space capacity isn't set. If the capacity
      is already set, the capacity can be adjusted from within the detail page. */}
      {activeModal.name === 'set-capacity' ? <SetCapacityModal
        space={activeModal.data.space}
        onSubmit={capacity => onSetCapacity(activeModal.data.space, capacity)}
        onDismiss={onCloseModal}
      /> : null}


      <div className="insights-space-list-container">
        <div className="insights-space-list-header">
          <h2 className="insights-space-list-header-text">Insights</h2>
        </div>
        <div className="insights-space-list-filter-row">
          {/* Left-aligned filter box */}
          <InputBox
            type="text"
            className="insights-space-list-search-box"
            placeholder="Filter Spaces ..."
            disabled={this.state.view === ERROR}
            value={spaces.filters.search}
            onChange={e => onSpaceSearch(e.target.value)}
          />

          {/* Right-aligned utiliation time segment and data duration filters */}
          <div className="insights-space-list-text-label">Utilization for</div>
          <InputBox
            type="select"
            className="insights-space-list-time-segment-selector"
            value={this.state.timeSegment}
            disabled={this.state.view === ERROR}
            onChange={e => {
              this.setState({timeSegment: e.target.value}, () => this.fetchData());
            }}
          >
            {Object.keys(TIME_SEGMENTS).map(i => [i, TIME_SEGMENTS[i]]).map(([key, {start, end, name}]) => {
              return <option value={key} key={key}>
                {name} ({start > 12 ? `${start-12}p` : `${start}a`} - {end > 12 ? `${end-12}p` : `${end}a`})
              </option>;
            })}
          </InputBox>
          <div className="insights-space-list-text-label">over past</div>
          <InputBox
            type="select"
            className="insights-space-list-duration-selector"
            value={this.state.dataDuration}
            disabled={this.state.view === ERROR}
            onChange={e => {
              this.setState({dataDuration: e.target.value, spaceCounts: {}, view: LOADING}, () => this.fetchData());
            }}
          >
            <option value={DATA_DURATION_WEEK}>Week</option>
            <option disabled value={DATA_DURATION_MONTH}>Month (coming soon)</option>
          </InputBox>
        </div>

        <Card>
          {this.state.view === LOADING ? <CardLoading indeterminate /> : null}

          <CardHeader className="insights-space-list-summary-header">
            {(() => {
              if (this.state.view === VISIBLE && filteredSpaces.length === 0) {
                return <span>No spaces matched your filter</span>
              } else if (this.state.view === VISIBLE) {
                return <span>
                  Your {filteredSpaces.length}
                  {filteredSpaces.length === 1 ? ' space has ' : ' spaces have '} seen
                  <span className="insights-space-list-summary-header-highlight">
                    {commaFormatNumber(this.calculateTotalNumberOfEventsForSpaces(filteredSpaces))}
                  </span>
                  visitors during
                  <span className="insights-space-list-summary-header-highlight" style={{margin:0}}>
                    {` ${TIME_SEGMENTS[this.state.timeSegment].phrasal} `}
                  </span>
                  this past
                  <span className="insights-space-list-summary-header-highlight">
                    {this.state.dataDuration === DATA_DURATION_WEEK ? 'week' : 'month'}
                  </span>
                </span>;
              } else {
                return <span>&mdash;</span>;
              }
            })()}
          </CardHeader>

          {filteredSpaces.length > 0 ? <CardBody className="insights-space-list-card-body">
            <SortableGridHeader className="insights-space-list-grid-header">
              <SortableGridHeaderItem
                width={2}
                active={this.state.activeColumn === COLUMN_SPACE_NAME}
                sort={this.state.columnSortOrder}
                onActivate={() => this.setState({activeColumn: COLUMN_SPACE_NAME, columnSortOrder: DEFAULT_SORT_DIRECTION})}
                onFlipSortOrder={columnSortOrder => this.setState({columnSortOrder})}
              >Space</SortableGridHeaderItem>
              <SortableGridHeaderItem
                width={1}
                active={this.state.activeColumn === COLUMN_CAPACITY}
                sort={this.state.columnSortOrder}
                onActivate={() => this.setState({activeColumn: COLUMN_CAPACITY, columnSortOrder: DEFAULT_SORT_DIRECTION})}
                onFlipSortOrder={columnSortOrder => this.setState({columnSortOrder})}
              >Capacity</SortableGridHeaderItem>
              <SortableGridHeaderItem
                width={3}
                active={this.state.activeColumn === COLUMN_UTILIZATION}
                sort={this.state.columnSortOrder}
                onActivate={() => this.setState({activeColumn: COLUMN_UTILIZATION, columnSortOrder: DEFAULT_SORT_DIRECTION})}
                onFlipSortOrder={columnSortOrder => this.setState({columnSortOrder})}
              >Past Week's Utilization</SortableGridHeaderItem>
            </SortableGridHeader>

            <div className="insights-space-list-items">
              {filteredSpaces.slice().sort((a, b) => {
                if (this.state.activeColumn === COLUMN_SPACE_NAME) {
                  const value = this.state.columnSortOrder === SORT_ASC ? a.name < b.name : a.name > b.name;
                  return value ? 1 : -1;
                } else if (this.state.activeColumn === COLUMN_UTILIZATION) {
                  if (this.state.columnSortOrder === SORT_ASC) {
                    // If a doesn't have a utilization but b does, then sort a above b (and vice-versa)
                    if (typeof spaceUtilizations[a.id] === 'undefined') { return -1; }
                    if (typeof spaceUtilizations[b.id] === 'undefined') { return 1; }

                    return spaceUtilizations[a.id] - spaceUtilizations[b.id];
                  } else {
                    // If a doesn't have a utilization but b does, then sort a below b (and vice-versa)
                    if (typeof spaceUtilizations[a.id] === 'undefined') { return 1; }
                    if (typeof spaceUtilizations[b.id] === 'undefined') { return -1; }

                    return spaceUtilizations[b.id] - spaceUtilizations[a.id];
                  }
                } else if (this.state.activeColumn === COLUMN_CAPACITY) {
                  if (this.state.columnSortOrder === SORT_ASC) {
                    // If a doesn't have a capacity but b does, then sort a above b (and vice-versa)
                    if (!a.capacity) { return -1; }
                    if (!b.capacity) { return 1; }

                    return a.capacity > b.capacity;
                  } else {
                    // If a doesn't have a capacity but b does, then sort a above b (and vice-versa)
                    if (!a.capacity) { return 1; }
                    if (!b.capacity) { return -1; }

                    return a.capacity < b.capacity;
                  }
                } else {
                  // This should never happen.
                  return 0;
                }
              }).map(space => {
                return <div
                  className="insights-space-list-item"
                  key={space.id}

                  // When the row is clicked, move to the detail page.
                  onClick={() => window.location.href = `#/spaces/insights/${space.id}`}
                >
                  <span className="insights-space-list-item-name">{space.name}</span>
                  <span className="insights-space-list-item-capacity">
                    {
                      space.capacity !== null ?
                        <span>{space.capacity}</span> :
                        <a onClick={e => {
                          // Keep the row click handler from firing when 'set capacity' is clicked
                          e.stopPropagation();

                          return onOpenModal('set-capacity', {space});
                        }}>Set capacity</a>
                    }
                  </span>
                  <div className="insights-space-list-item-utilization">
                    <div className="insights-space-list-item-utilization-bar">
                      <div
                        className="insights-space-list-item-utilization-bar-inner"
                        style={{width: `${spaceUtilizations[space.id] > 1 ? 100 : spaceUtilizations[space.id] * 100}%`}}
                      />
                    </div>

                    {
                      typeof spaceUtilizations[space.id] === 'undefined' ? 
                      <div className="insights-space-list-item-utilization-label disabled">&mdash;</div> :
                      <div className="insights-space-list-item-utilization-label">{Math.round(spaceUtilizations[space.id] * 100)}%</div>
                    }

                    <span className="insights-space-list-item-arrow">&#xe90f;</span>
                  </div>
                </div>;
              })}
            </div>
          </CardBody> : null}
        </Card>
      </div>
    </div>;
  }
}

export default connect(state => {
  return {
    spaces: state.spaces,
    activeModal: state.activeModal,
  };
}, dispatch => {
  return {
    onSpaceSearch(searchQuery) {
      dispatch(collectionSpacesFilter('search', searchQuery));
    },

    onSetCapacity(space, capacity) {
      dispatch(collectionSpacesUpdate({...space, capacity})).then(ok => {
        ok && dispatch(hideModal());
      });
    },

    onOpenModal(name, data) {
      dispatch(showModal(name, data));
    },
    onCloseModal() {
      dispatch(hideModal());
    },
  };
})(InsightsSpaceList);
