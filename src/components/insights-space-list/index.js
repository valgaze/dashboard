import * as React from 'react';
import { connect } from 'react-redux';
import ErrorBar from '../error-bar/index';
import SortableGridHeader, { SortableGridHeaderItem, SORT_ASC, SORT_DESC } from '../sortable-grid-header/index';

import { core } from '../../client';
import moment from 'moment';

import collectionSpacesFilter from '../../actions/collection/spaces/filter';

import InputBox from '@density/ui-input-box';
import Card, { CardHeader, CardBody, CardLoading } from '@density/ui-card';

import spaceUtilizationPerGroup, {
  groupCountsByDay,
  groupCountFilter,
  isWithinTimeSegment,
  TIME_SEGMENTS,
} from '../../helpers/space-utilization/index';

import filterCollection from '../../helpers/filter-collection/index';
const spaceFilter = filterCollection({fields: ['name']});

// Used to store which colum is the active column.
const COLUMN_SPACE_NAME = 'COLUMN_SPACE_NAME',
      COLUMN_UTILIZATION = 'COLUMN_UTILIZATION';

// By default, sort in decending order.
const DEFAULT_SORT_DIRECTION = SORT_DESC;

export class InsightsSpaceList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      spaceCounts: {},

      // Start by sorting the space name column in an acending order.
      activeColumn: COLUMN_SPACE_NAME,
      columnSortOrder: DEFAULT_SORT_DIRECTION,

      timeSegment: 'WORKING_HOURS',
    };

    this.fetchData();
  }

  async fetchData(spaces=this.props.spaces) {
    if (!(spaces && Array.isArray(spaces.data))) {
      return
    }

    const spacesToFetch = spaces.data
      // Remove all spaces that don't have a capacity
      .filter(i => i.capacity != null)
      // Remove all spaces that have already had their counts fetched.
      .filter(space => typeof this.state.spaceCounts[space.id] === 'undefined')

    // Bail early if there is no work to do.
    if (spacesToFetch.length === 0) {
      return
    }

    // Fetch counts for each space.
    const requests = spacesToFetch.map(space => {
      // Get the last full week of data.
      const startTime = moment.utc().tz(space.timeZone).startOf('week').subtract(1, 'week').add(1, 'day').format();
      const endTime = moment.utc().tz(space.timeZone).subtract(1, 'week').endOf('week').subtract(1, 'day').format();

      // Get all counts within that last full week. Request as many pages as required.
      return (async function getCountPage(page=1, pageSize=1000) {
        const data = await core.spaces.counts({
          id: space.id,
          start_time: startTime,
          end_time: endTime,
          interval: '10m',

          page,
          page_size: pageSize,
        });

        if (data.next) {
          return [...data.results, await getCountPage(page+1)];
        } else {
          return data.results;
        }
      })();
    });

    const spaceCountsArray = await Promise.all(requests);

    const spaceCounts = {
      ...this.state.spaceCounts,
      ...spaceCountsArray.reduce((acc, i, ct) => ({...acc, [spacesToFetch[ct].id]: i}), {}),
    };

    this.setState({
      spaceCounts,
      loading: false,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps.spaces);
  }

  render() {
    const { spaces, onSpaceSearch } = this.props;

    let spaceUtilizations = {};
    if (!this.state.loading) {
      spaceUtilizations = Object.keys(this.state.spaceCounts).reduce((acc, spaceId, ct) => {
        const space = spaces.data.find(i => i.id === spaceId);
        const counts = this.state.spaceCounts[spaceId];

        const groups = groupCountsByDay(counts, space.timeZone);
        const filteredGroups = groupCountFilter(groups, count =>
          isWithinTimeSegment(count.timestamp, space.timeZone, TIME_SEGMENTS[this.state.timeSegment]));
        const result = spaceUtilizationPerGroup(space, filteredGroups);
        return {
          ...acc,
          [space.id]: result.reduce((acc, i) => acc + i.averageUtilization, 0) / result.length * 100,
        };
      }, {});
    }

    return <div className="insights-space-list">
      {/* Show errors in the spaces collection. */}
      <ErrorBar message={spaces.error} showRefresh />

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
            value={spaces.filters.search}
            onChange={e => onSpaceSearch(e.target.value)}
          />

          <div className="insights-space-list-text-label">Utilization for</div>
          <InputBox
            type="select"
            className="insights-space-list-time-segment-selector"
            value={this.state.timeSegment}
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
            defaultValue={"week"}
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
          </InputBox>
        </div>

        <Card>
          {this.state.loading ? <CardLoading indeterminate /> : null}
          <CardHeader className="insights-space-list-summary-header">
            Some fancy shmancy collective space metric goes here
            <space className="insights-space-list-summary-header-highlight">50%</space>
          </CardHeader>
          <CardBody className="insights-space-list-card-body">
            <SortableGridHeader>
              <SortableGridHeaderItem
                width={1}
                active={this.state.activeColumn === COLUMN_SPACE_NAME}
                sort={this.state.columnSortOrder}
                onActivate={() => this.setState({activeColumn: COLUMN_SPACE_NAME, columnSortOrder: DEFAULT_SORT_DIRECTION})}
                onFlipSortOrder={columnSortOrder => this.setState({columnSortOrder})}
              >Space</SortableGridHeaderItem>
              <SortableGridHeaderItem
                width={3}
                active={this.state.activeColumn === COLUMN_UTILIZATION}
                sort={this.state.columnSortOrder}
                onActivate={() => this.setState({activeColumn: COLUMN_UTILIZATION, columnSortOrder: DEFAULT_SORT_DIRECTION})}
                onFlipSortOrder={columnSortOrder => this.setState({columnSortOrder})}
              >Utilization</SortableGridHeaderItem>
            </SortableGridHeader>

            <div className="insights-space-list-items">
              {spaceFilter(spaces.data, spaces.filters.search).sort((a, b) => {
                if (this.state.activeColumn === COLUMN_SPACE_NAME) {
                  const value = this.state.columnSortOrder === SORT_ASC ? a.name < b.name : a.name > b.name;
                  return value ? 1 : -1;
                } else if (this.state.activeColumn === COLUMN_UTILIZATION) {
                  if (this.state.columnSortOrder === SORT_ASC) {
                    // If a doesn't have a utilization but b does, then sort a above b (and vice-versa)
                    if (!spaceUtilizations[a.id]) { return -1; }
                    if (!spaceUtilizations[b.id]) { return 1; }

                    return spaceUtilizations[a.id] > spaceUtilizations[b.id];
                  } else {
                    // If a doesn't have a utilization but b does, then sort a below b (and vice-versa)
                    if (!spaceUtilizations[a.id]) { return 1; }
                    if (!spaceUtilizations[b.id]) { return -1; }

                    return spaceUtilizations[a.id] < spaceUtilizations[b.id];
                  }
                } else {
                  // This should never happen.
                  return 0;
                }
              }).map(space => {
                return <div className="insights-space-list-item" key={space.id}>
                  <span className="insights-space-list-item-name">{space.name}</span>
                  <span className="insights-space-list-item-utilization">
                    {spaceUtilizations[space.id]}% used on average throughout the day
                  </span>
                </div>;
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>;
  }
}

export default connect(state => {
  return {
    spaces: state.spaces,
    foo: false,
  };
}, dispatch => {
  return {
    onSpaceSearch(searchQuery) {
      dispatch(collectionSpacesFilter('search', searchQuery));
    },
  };
})(InsightsSpaceList);
