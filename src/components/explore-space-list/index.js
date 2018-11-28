import React, { Component } from 'react';
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
import { calculate as exploreSpaceListCalculate } from '../../actions/route-transition/explore-space-list';

import InputBox from '@density/ui-input-box';
import Card, { CardBody, CardLoading, CardWell, CardWellHighlight } from '@density/ui-card';
import SetCapacityModal from '../explore-set-capacity-modal/index';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';

import spaceUtilizationPerGroup, {
  groupCountsByDay,
} from '../../helpers/space-utilization/index';
import { DEFAULT_TIME_SEGMENT_GROUP } from '../../helpers/time-segments/index';
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

export class ExploreSpaceList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Start by sorting the space name column in an acending order.
      activeColumn: COLUMN_SPACE_NAME,
      columnSortOrder: DEFAULT_SORT_DIRECTION,

      dataDuration: DATA_DURATION_WEEK,
    };
  }

  calculateTotalNumberOfIngressesForSpaces(spaces=this.props.spaces.data) {
    const spaceIds = spaces.map(i => i.id);
    let eventCount = 0;
    for (let id in this.props.calculatedData.data.spaceCounts) {
      if (spaceIds.indexOf(id) === -1) { continue }
      const counts = this.props.calculatedData.data.spaceCounts[id];

      // Total up all ingresses within each count bucket in that time range
      eventCount += counts.reduce((acc, i) => acc + i.interval.analytics.entrances, 0);
    }

    return eventCount;
  }

  render() {
    const {
      spaces,
      timeSegmentGroups,
      activeModal,

      calculatedData,

      onSpaceSearch,
      onSpaceChangeParent,
      onOpenModal,
      onCloseModal,
      onSetCapacity,
      onChangeTimeSegmentGroup,
    } = this.props;

    const parentSpace = spaces.filters.parent ?
      spaces.data.find(i => i.id === spaces.filters.parent) :
      null;

    const timeSegmentGroup = timeSegmentGroups.data.find(
      i => i.id === spaces.filters.timeSegmentGroupId,
    ) || DEFAULT_TIME_SEGMENT_GROUP;


    // Filter space list
    // 1. Using the space hierarchy `parent value`
    // 2. Using the fuzzy search
    // 3. Only show 'space' type spaces
    // 4. Within the time segment group that was specified
    let filteredSpaces = spaces.data;
    if (spaces.filters.parent) {
      filteredSpaces = filterHierarchy(filteredSpaces, spaces.filters.parent);
    }
    if (spaces.filters.search) {
      filteredSpaces = spaceFilter(filteredSpaces, spaces.filters.search);
    }
    filteredSpaces = filteredSpaces
      .filter(space => space.spaceType === 'space')
      .filter(space => {
        if (calculatedData.state === 'LOADING') {
          // When still loading / calculating the `spaceCounts` object, show all spaces
          return true;
        } else {
          // Ensure that all shown spaces have count data that was returned from the server
          return typeof calculatedData.data.spaceCounts[space.id] !== 'undefined';
        }
      })

    return <div className="explore-space-list">
      <ErrorBar
        message={spaces.error || timeSegmentGroups.error || calculatedData.error}
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


      <div className="explore-space-list-container">
        <div className="explore-space-list-header">
          <h2 className="explore-space-list-header-text">Explore</h2>
        </div>
        <div className="explore-space-list-filter-spaces-row explore-space-list-search-box">
          {/* Left-aligned filter box */}
          <InputBox
            type="text"
            width={250}
            placeholder="Filter Spaces ..."
            disabled={calculatedData.state === 'ERROR'}
            value={spaces.filters.search}
            onChange={e => onSpaceSearch(e.target.value)}
          />
        </div>

        <Card>
          {calculatedData.state === 'LOADING' ? <CardLoading indeterminate /> : null}

          <CardWell type="dark" className="explore-space-list-summary-header">
            {(() => {
              if (calculatedData.state === 'COMPLETE' && filteredSpaces.length === 0) {
                return <span>No spaces matched your filters</span>
              } else if (calculatedData.state === 'COMPLETE') {
                return <span>
                  {(function(search) {
                    if (filteredSpaces.length === 1) {
                      return search !== '' ? 'This ' : 'Your ';
                    } else {
                      return search !== '' ? 'These ' : 'Your ';
                    }
                  })(spaces.filters.search)}

                  {/* 5 spaces */}
                  <CardWellHighlight>
                    {filteredSpaces.length}
                    {filteredSpaces.length === 1 ? ' space' : ' spaces'}
                  </CardWellHighlight>

                  {/* Rendering hierarchical section of sentence - `in building` / `on floor` */}
                  {parentSpace && parentSpace.spaceType === 'campus' ? ' in ' : ''}
                  {parentSpace && parentSpace.spaceType === 'building' ? ' in ' : ''}
                  {parentSpace && parentSpace.spaceType === 'floor' ? ' on ' : ''}
                  {parentSpace ? <CardWellHighlight>{parentSpace.name}</CardWellHighlight> : ''}

                  {filteredSpaces.length === 1 ? ' has ' : ' have '}
                  seen <CardWellHighlight>
                    {commaFormatNumber(
                      this.calculateTotalNumberOfIngressesForSpaces(filteredSpaces)
                    )} visitors
                  </CardWellHighlight> during <CardWellHighlight>
                    {timeSegmentGroup.name}
                  </CardWellHighlight> this past <CardWellHighlight>
                    {this.state.dataDuration === DATA_DURATION_WEEK ? 'week' : 'month'}
                  </CardWellHighlight>
                </span>;
              } else {
                return <span>&mdash;</span>;
              }
            })()}
          </CardWell>

          <CardBody className="explore-space-list-filters">
            <span className="explore-space-list-filter-item">
              <SpaceHierarchySelectBox
                className="explore-space-list-space-hierarchy-selector"
                value={parentSpace}
                choices={spaces.data.filter(i => i.spaceType !== 'space')}
                onChange={parent => onSpaceChangeParent(parent ? parent.id : null)}
              />
            </span>

            {/* Utiliation time segment and data duration filters */}
            <div className="explore-space-list-filter-item explore-space-list-time-segment-selector">
              <InputBox
                type="select"
                value={spaces.filters.timeSegmentGroupId}
                disabled={calculatedData.state !== 'COMPLETE'}
                onChange={e => onChangeTimeSegmentGroup(e.id)}
                choices={[
                  DEFAULT_TIME_SEGMENT_GROUP,
                  ...timeSegmentGroups.data,
                ].map(({id, name}) => ({ id, label: <span>{name}</span> }))}
              />
            </div>
            <div className="explore-space-list-filter-item explore-space-list-duration-selector">
              <InputBox
                type="select"
                value={this.state.dataDuration}
                disabled={calculatedData.state !== 'COMPLETE'}
                onChange={e => { /* TODO: do something here */ }}
                choices={[
                  {id: DATA_DURATION_WEEK, label: 'Week'},
                  {id: DATA_DURATION_MONTH, label: <span>Month <small>(coming soon)</small></span>, disabled: true},
                ]}
              />
            </div>
          </CardBody>

          {filteredSpaces.length > 0 ? <CardBody className="explore-space-list-card-body">
            <div className="explore-space-list-card-body-header">
              <h3>Average Utilization</h3>
            </div>
            <table className="explore-space-list">
              <tbody>
                <SortableGridHeader className="explore-space-list-item header">
                  <SortableGridHeaderItem
                    className="explore-space-list-item-name"
                    active={this.state.activeColumn === COLUMN_SPACE_NAME}
                    sort={this.state.columnSortOrder}
                    onActivate={() => this.setState({activeColumn: COLUMN_SPACE_NAME, columnSortOrder: DEFAULT_SORT_DIRECTION})}
                    onFlipSortOrder={columnSortOrder => this.setState({columnSortOrder})}
                  >Space</SortableGridHeaderItem>
                  <SortableGridHeaderItem
                    className="explore-space-list-item-capacity"
                    active={this.state.activeColumn === COLUMN_CAPACITY}
                    sort={this.state.columnSortOrder}
                    onActivate={() => this.setState({activeColumn: COLUMN_CAPACITY, columnSortOrder: DEFAULT_SORT_DIRECTION})}
                    onFlipSortOrder={columnSortOrder => this.setState({columnSortOrder})}
                  >
                    {document.body && document.body.clientWidth > gridVariables.screenSmMin ? 'Capacity' : 'Cap.'}
                  </SortableGridHeaderItem>
                  <SortableGridHeaderItem
                    className="explore-space-list-item-utilization"
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
                      if (typeof calculatedData.data.spaceUtilizations[a.id] === 'undefined') { return -1; }
                      if (typeof calculatedData.data.spaceUtilizations[b.id] === 'undefined') { return 1; }

                      return calculatedData.data.spaceUtilizations[a.id] - calculatedData.data.spaceUtilizations[b.id];
                    } else {
                      // If a doesn't have a utilization but b does, then sort a below b (and vice-versa)
                      if (typeof calculatedData.data.spaceUtilizations[a.id] === 'undefined') { return 1; }
                      if (typeof calculatedData.data.spaceUtilizations[b.id] === 'undefined') { return -1; }

                      return calculatedData.data.spaceUtilizations[b.id] - calculatedData.data.spaceUtilizations[a.id];
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
                    className="explore-space-list-item body-row"
                    key={space.id}

                    // When the row is clicked, move to the detail page.
                    onClick={() => window.location.href = `#/spaces/explore/${space.id}/trends`}
                  >
                    <td className="explore-space-list-item-name">{space.name}</td>
                    <td
                      className="explore-space-list-item-capacity"
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
                          <a href=''>{document.body && document.body.clientWidth > gridVariables.screenSmMin ? 'Set capacity' : 'Set'}</a>
                      }
                    </td>
                    <td className="explore-space-list-item-utilization">
                      <PercentageBar
                        percentage={calculatedData.data.spaceUtilizations[space.id] || 0}
                        percentageFormatter={percentage => {
                          // Format the capacity and display as percent as long as these two
                          // conditions are true:
                          // 1. The component is no longer loading.
                          // 2. The space being rendered has a capacity.
                          return (
                            calculatedData.state === 'COMPLETE' && space.capacity !== null
                          ) ? `${formatPercentage(percentage, 0)}%` : null;
                        }}
                      />

                      <span className="explore-space-list-item-arrow">&#xe90f;</span>
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
    timeSegmentGroups: state.timeSegmentGroups,

    calculatedData: state.exploreData.calculations.spaceList,
  };
}, dispatch => {
  return {
    onSpaceSearch(searchQuery) {
      dispatch(collectionSpacesFilter('search', searchQuery));
    },
    onSpaceChangeParent(parentId) {
      dispatch(collectionSpacesFilter('parent', parentId));
    },

    onChangeTimeSegmentGroup(timeSegmentGroupId) {
      dispatch(collectionSpacesFilter('timeSegmentGroupId', timeSegmentGroupId));
      dispatch(exploreSpaceListCalculate());
    },

    async onSetCapacity(space, capacity) {
      const ok = await dispatch(collectionSpacesUpdate({...space, capacity}));
      if (ok) {
        dispatch(hideModal());
      }
      dispatch(exploreSpaceListCalculate());
    },

    onOpenModal(name, data) {
      dispatch(showModal(name, data));
    },
    onCloseModal() {
      dispatch(hideModal());
    },
  };
})(ExploreSpaceList);
