import * as React from 'react';
import { connect } from 'react-redux';
import ErrorBar from '../error-bar/index';
import SortableGridHeader, { SortableGridHeaderItem, SORT_ASC, SORT_DESC } from '../sortable-grid-header/index';
import PercentageBar from '@density/ui-percentage-bar';

import gridVariables from '@density/ui/variables/grid.json';

import SpaceHierarchySelectBox from '../space-hierarchy-select-box/index';

import { core } from '../../client';
import moment from 'moment';

import collectionSpacesFilter from '../../actions/collection/spaces/filter';
import collectionSpacesUpdate from '../../actions/collection/spaces/update';

import InputBox from '@density/ui-input-box';
import Card, { CardBody, CardLoading, CardWell, CardWellHighlight } from '@density/ui-card';
import SetCapacityModal from '../insights-set-capacity-modal/index';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';

import spaceUtilizationPerGroup, {
  groupCountsByDay,
  isWithinTimeSegment,
  TIME_SEGMENTS,
} from '../../helpers/space-utilization/index';
import fetchAllPages from '../../helpers/fetch-all-pages/index';
import commaFormatNumber from '../../helpers/comma-format-number/index';
import formatPercentage from '../../helpers/format-percentage/index';

import filterHierarchy from '../../helpers/filter-hierarchy/index';

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

      // Get the last full week of data.
      // NOTE: The below times don't have timezones. This is purposeful - the
      // `core.spaces.allCounts` call below can accept timezoneless timestamps, which in this case,
      // is desired so that we can get from `startTime` to `endTime` in the timezone of each space,
      // rather than in a fixed timezone between all spaces (since the list of spaces can be in
      // multiple timezones)
      let startTime,
          endTime = moment.utc().subtract(1, 'week').endOf('week').subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss');
      if (this.state.dataDuration === DATA_DURATION_WEEK) {
        startTime = moment.utc().subtract(1, 'week').startOf('week').add(1, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss');
      } else {
        startTime = moment.utc().subtract(1, 'month').format('YYYY-MM-DDTHH:mm:ss');
      }

      // Get all counts within that last full week. Request as many pages as required.
      const data = await fetchAllPages(page => {
        return core.spaces.allCounts({
          start_time: startTime,
          end_time: endTime,
          interval: '10m',
          page,
          page_size: 1000,
        });
      });

      // Add a `timestampAsMoment` property which converts the timestamp into a moment. This is so
      // that this expensive step doesn't have to be performed on each component render in the
      // `.calculateTotalNumberOfEventsForSpaces` method or have to be performed again below in the
      // utilization calculation.
      for (const spaceId in data) {
        const space = spaces.data.find(i => i.id === spaceId);

        for (let ct = 0; ct < data[spaceId].length; ct++) {
          data[spaceId][ct].timestampAsMoment = moment.utc(
            data[spaceId][ct].timestamp,
            'YYYY-MM-DDTHH:mm:ssZ'
          ).tz(space.timeZone);
        }
      }
      const spaceCounts = { ...this.state.spaceCounts, ...data };

      // Utilization calculation.
      // For each space, group counts into buckets, each a single day long.
      const spaceUtilizations = Object.keys(spaceCounts).reduce((acc, spaceId, ct) => {
        // If a space doesn't have a capacity, don't use it for calculating utilization.
        if (!canSpaceBeUsedToCalculateUtilization[spaceId]) { return acc; }

        const space = spaces.data.find(i => i.id === spaceId);
        const counts = spaceCounts[spaceId];

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
                count.timestampAsMoment,
                space.timeZone,
                TIME_SEGMENTS[this.state.timeSegment]
              );
            }),
          };
        });

        const result = spaceUtilizationPerGroup(space, filteredGroups);

        return {
          ...acc,
          [space.id]: result.reduce((acc, i) => acc + i.averageUtilization, 0) / result.length,
        };
      }, {});

      // NOTE: This is kinda an antipattern, but cancelling fetch calls looks to be a bit involved, so
      // taking the easy solution for now.
      if (!this.mounted) { return; }

      this.setState({
        view: VISIBLE,
        spaceCounts,
        spaceUtilizations,
      });
    } catch (error) {
      // NOTE: This is kinda an antipattern, but cancelling fetch calls looks to be a bit involved, so
      // taking the easy solution for now.
      if (!this.mounted) { return; }

      // Something went wrong. Update the state of the component such that it shows the error in the
      // error bar.
      this.setState({view: ERROR, error: `Could not fetch space counts: ${error.message}`});
    }

    this.fetchDataLock = false;
  }

  componentDidMount() { this.mounted = true; }
  componentWillUnmount() { this.mounted = false; }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps.spaces);
  }

  calculateTotalNumberOfIngressesForSpaces(spaces=this.props.spaces.data) {
    const spaceIds = spaces.map(i => i.id);
    const spaceTimeZones = spaces.reduce((acc, i) => ({...acc, [i.id]: i.timeZone}), {});

    let eventCount = 0;
    for (let id in this.state.spaceCounts) {
      if (spaceIds.indexOf(id) === -1) { continue }
      const counts = this.state.spaceCounts[id];

      // Remove all counts outside of the time range
      const countsWithinTimeSegment = counts.filter(i => {
        return isWithinTimeSegment(
          i.timestampAsMoment,
          spaceTimeZones[id],
          TIME_SEGMENTS[this.state.timeSegment]
        );
      });

      // Total up all ingresses within each count bucket in that time range
      eventCount += countsWithinTimeSegment.reduce(
        (acc, i) => acc + i.interval.analytics.entrances,
        0
      );
    }

    return eventCount;
  }

  render() {
    const {
      spaces,
      activeModal,

      onSpaceSearch,
      onSpaceChangeParent,
      onOpenModal,
      onCloseModal,
      onSetCapacity,
    } = this.props;

    // Filter space list
    // 1. Using the fuzzy search
    // 2. Using the space hierarchy `parent value`
    let filteredSpaces = spaceFilter(spaces.data, spaces.filters.search);
    if (spaces.filters.parent) {
      filteredSpaces = filterHierarchy(filteredSpaces, spaces.filters.parent);
    }

    const parentSpace = spaces.filters.parent ?
      spaces.data.find(i => i.id === spaces.filters.parent) :
      null;

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
        onSubmit={async capacity => {
          await onSetCapacity(activeModal.data.space, capacity);

          // After loading capacities, refetch and recalculate data.
          this.setState({
            view: LOADING,
            spaceCounts: {},
            spaceUtilizations: {},
          }, () => this.fetchData());
        }}
        onDismiss={onCloseModal}
      /> : null}


      <div className="insights-space-list-container">
        <div className="insights-space-list-header">
          <h2 className="insights-space-list-header-text">Insights</h2>
        </div>
        <div className="insights-space-list-filter-spaces-row">
          {/* Left-aligned filter box */}
          <InputBox
            type="text"
            className="insights-space-list-search-box"
            placeholder="Filter Spaces ..."
            disabled={this.state.view === ERROR}
            value={spaces.filters.search}
            onChange={e => onSpaceSearch(e.target.value)}
          />
        </div>

        <Card>
          {this.state.view === LOADING ? <CardLoading indeterminate /> : null}

          <CardWell type="dark" className="insights-space-list-summary-header">
            {(() => {
              if (this.state.view === VISIBLE && filteredSpaces.length === 0) {
                return <span>No spaces matched your filter</span>
              } else if (this.state.view === VISIBLE) {
                return <span>
                  {(function(search) {
                    if (filteredSpaces.length === 1) {
                      return search !== '' ? 'This ' : 'Your ';
                    } else {
                      return search !== '' ? 'These ' : 'Your ';
                    }
                  })(spaces.filters.search)}
                  {filteredSpaces.length}
                  {filteredSpaces.length === 1 ? ' space has ' : ' spaces have '}
                  seen <CardWellHighlight>
                    {commaFormatNumber(this.calculateTotalNumberOfIngressesForSpaces(filteredSpaces))}
                  </CardWellHighlight> visitors during <span>
                    {TIME_SEGMENTS[this.state.timeSegment].phrasal}
                  </span> this past <span>
                    {this.state.dataDuration === DATA_DURATION_WEEK ? 'week' : 'month'}
                  </span>
                </span>;
              } else {
                return <span>&mdash;</span>;
              }
            })()}
          </CardWell>

          <CardBody className="insights-space-list-filters">
            <span className="insights-space-list-filter-item">
              <SpaceHierarchySelectBox
                className="insights-space-list-space-hierarchy-selector"
                value={parentSpace}
                choices={spaces.data.filter(i => i.spaceType !== 'space')}
                onChange={parent => onSpaceChangeParent(parent ? parent.id : null)}
              />
            </span>

            {/* Utiliation time segment and data duration filters */}
            <div className="insights-space-list-filter-item">
              <InputBox
                type="select"
                className="insights-space-list-time-segment-selector"
                value={this.state.timeSegment}
                disabled={this.state.view !== VISIBLE}
                onChange={e => {
                  this.setState({
                    view: LOADING,
                    timeSegment: e.id,
                    spaceCounts: {},
                    spaceUtilizations: {},
                  }, () => this.fetchData());
                }}
                choices={Object.keys(TIME_SEGMENTS).map(i => [i, TIME_SEGMENTS[i]]).map(([key, {start, end, name}]) => {
                  return {
                    id: key,
                    label: <span>{name} ({start > 12 ? `${start-12}p` : `${start}a`} - {end > 12 ? `${end-12}p` : `${end}a`})</span>,
                  };
                })}
              />
            </div>
            <div className="insights-space-list-filter-item">
              <InputBox
                type="select"
                className="insights-space-list-duration-selector"
                value={this.state.dataDuration}
                disabled={this.state.view !== VISIBLE}
                onChange={e => {
                  this.setState({
                    view: LOADING,
                    dataDuration: e.id,
                    spaceCounts: {},
                  }, () => this.fetchData());
                }}
                choices={[
                  {id: DATA_DURATION_WEEK, label: 'Week'},
                  {id: DATA_DURATION_MONTH, label: <span>Month <small>(coming soon)</small></span>, disabled: true},
                ]}
              />
            </div>
          </CardBody>

          {filteredSpaces.length > 0 ? <CardBody className="insights-space-list-card-body">
            <table className="insights-space-list">
              <tbody>
                <SortableGridHeader className="insights-space-list-item header">
                  <SortableGridHeaderItem
                    className="insights-space-list-item-name"
                    active={this.state.activeColumn === COLUMN_SPACE_NAME}
                    sort={this.state.columnSortOrder}
                    onActivate={() => this.setState({activeColumn: COLUMN_SPACE_NAME, columnSortOrder: DEFAULT_SORT_DIRECTION})}
                    onFlipSortOrder={columnSortOrder => this.setState({columnSortOrder})}
                  >Space</SortableGridHeaderItem>
                  <SortableGridHeaderItem
                    className="insights-space-list-item-capacity"
                    active={this.state.activeColumn === COLUMN_CAPACITY}
                    sort={this.state.columnSortOrder}
                    onActivate={() => this.setState({activeColumn: COLUMN_CAPACITY, columnSortOrder: DEFAULT_SORT_DIRECTION})}
                    onFlipSortOrder={columnSortOrder => this.setState({columnSortOrder})}
                  >
                    {document.body && document.body.clientWidth > gridVariables.screenSmMin ? 'Capacity' : 'Cap.'}
                  </SortableGridHeaderItem>
                  <SortableGridHeaderItem
                    className="insights-space-list-item-utilization"
                    active={this.state.activeColumn === COLUMN_UTILIZATION}
                    sort={this.state.columnSortOrder}
                    onActivate={() => this.setState({activeColumn: COLUMN_UTILIZATION, columnSortOrder: DEFAULT_SORT_DIRECTION})}
                    onFlipSortOrder={columnSortOrder => this.setState({columnSortOrder})}
                  >
                    {document.body && document.body.clientWidth > gridVariables.screenSmMin ? `Past Week's Utilization` : 'Utilization'}
                  </SortableGridHeaderItem>
                </SortableGridHeader>

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
                  return <tr
                    className="insights-space-list-item body-row"
                    key={space.id}

                    // When the row is clicked, move to the detail page.
                    onClick={() => window.location.href = `#/spaces/insights/${space.id}`}
                  >
                    <td className="insights-space-list-item-name">{space.name}</td>
                    <td
                      className="insights-space-list-item-capacity"
                      onClick={e => {
                        if (space.capacity === null) {
                          // Keep the row click handler from firing when 'set capacity' is clicked
                          e.stopPropagation();

                          return onOpenModal('set-capacity', {space});
                        }
                      }}
                    >
                      {
                        space.capacity !== null ?
                          <span>{space.capacity}</span> :
                          <a>{document.body && document.body.clientWidth > gridVariables.screenSmMin ? 'Set capacity' : 'Set'}</a>
                      }
                    </td>
                    <td className="insights-space-list-item-utilization">
                      <PercentageBar
                        percentage={spaceUtilizations[space.id]}
                        percentageFormatter={percentage => {
                          // Format the capacity and display as percent as long as these two
                          // conditions are true:
                          // 1. The component is no longer loading.
                          // 2. The space being rendered has a capacity.
                          return (
                            this.state.view === VISIBLE && space.capacity !== null
                          ) ? `${formatPercentage(percentage, 0)}%` : null;
                        }}
                      />

                      <span className="insights-space-list-item-arrow">&#xe90f;</span>
                    </td>
                  </tr>;
                })}
              </tbody>
            </table>
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
    onSpaceChangeParent(parentId) {
      dispatch(collectionSpacesFilter('parent', parentId));
    },

    onSetCapacity(space, capacity) {
      return dispatch(collectionSpacesUpdate({...space, capacity})).then(ok => {
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
