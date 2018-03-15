import * as React from 'react';
import { connect } from 'react-redux';
import ErrorBar from '../error-bar/index';

import { core } from '../../client';
import moment from 'moment';

import collectionSpacesFilter from '../../actions/collection/spaces/filter';

import InputBox from '@density/ui-input-box';

import spaceUtilizationPerGroup, {
  groupCountsByDay,
  groupCountFilter,
  isWithinTimeSegment,
  TIME_SEGMENTS,
} from '../../helpers/space-utilization/index';

import filterCollection from '../../helpers/filter-collection/index';
const spaceFilter = filterCollection({fields: ['name']});

export class InsightsSpaceList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      spaceCounts: {},
      spaceUtilizations: {},

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

    const spaceUtilizations = Object.keys(this.state.spaceCounts).reduce((acc, spaceId, ct) => {
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

    return <div className="insights-space-list">
      {/* Show errors in the spaces collection. */}
      <ErrorBar message={spaces.error} showRefresh />

      <div className="insights-space-list-container">
        <div className="insights-space-list-header">
          <h2 className="insights-space-list-header-text">Insights</h2>
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
          <InputBox
            type="text"
            className="insights-space-list-search-box"
            placeholder="Filter Spaces ..."
            value={spaces.filters.search}
            onChange={e => onSpaceSearch(e.target.value)}
          />
        </div>

        <div className="insights-space-list-row">
          {spaceFilter(spaces.data, spaces.filters.search).map(space => {
            return <div className="insights-space-list-item" key={space.id}>
              <a href={`#/spaces/insights/${space.id}`}>{space.name}</a>
              {spaceUtilizations[space.id]}% used on average throughout the day
            </div>;
          })}
        </div>
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
