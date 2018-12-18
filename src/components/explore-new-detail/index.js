import React from 'react';
import { connect } from 'react-redux';

import Report from '../report/index';

import InputBox from '@density/ui-input-box';
import SpaceHierarchySelectBox from '../space-hierarchy-select-box/index';
import collectionSpacesFilter from '../../actions/collection/spaces/filter';

import AppBar from '../app-bar/index';
import AppFrame from '../app-frame/index';
import AppPane from '../app-pane/index';
import AppScrollView from '../app-scroll-view/index';

import filterHierarchy from '../../helpers/filter-hierarchy/index';
import filterCollection from '../../helpers/filter-collection/index';
const spaceFilter = filterCollection({fields: ['name']});

export function NewExploreDetail({
  spaceIds,
  spaces,
  reports,
  calculatedReportData,

  onSpaceChangeParent,
  onSpaceSearch,
}) {
  // Filter space list
  // 1. Using the space hierarchy `parent value`
  // 2. Using the fuzzy search
  // 3. Only show 'space' type spaces
  let filteredSpaces = spaces.data;
  if (spaces.filters.parent) {
    filteredSpaces = filterHierarchy(filteredSpaces, spaces.filters.parent, {mustBeSpace: false}); /* 1 */
  }
  if (spaces.filters.search) {
    filteredSpaces = spaceFilter(filteredSpaces, spaces.filters.search); /* 2 */
  }
  // filteredSpaces = filteredSpaces.filter(space => space.spaceType === 'space') #<{(| 3 |)}>#

  return (
    <AppFrame>
      <AppPane>
        <AppBar title="Spaces" />
        <AppScrollView>
          <div className="explore-new-space-filters">
            <InputBox
              type="text"
              width={250}
              placeholder="Filter Spaces ..."
              value={spaces.filters.search}
              onChange={e => onSpaceSearch(e.target.value)}
            />

            <SpaceHierarchySelectBox
              value={spaces.filters.parent}
              choices={spaces.data.filter(i => i.spaceType !== 'space')}
              onChange={parent => onSpaceChangeParent(parent ? parent.id : null)}
            />
          </div>

          <ul>
            {filteredSpaces.sort((a, b) => a.name.localeCompare(b.name)).map(space => {
              if (spaceIds.indexOf(space.id) >= 0) {
                return (
                  <li key={space.id}>
                    [{space.spaceType}] {space.name}{' '}
                    <a href={`#/explore-new/${spaceIds.filter(i => i !== space.id).join(',')}`}>(remove)</a>
                  </li>
                );
              } else {
                return (
                  <li key={space.id}>
                    <a href={`#/explore-new/${[...spaceIds, space.id].join(',')}`}>
                      [{space.spaceType}] {space.name}
                    </a>
                  </li>
                );
              }
            })}
          </ul>
        </AppScrollView>
      </AppPane>
      <AppPane>
        <AppBar title="Space Data" />
        <div className="explore-new-detail">
          {reports.state === 'COMPLETE' && reports.data.length === 0 ? (
            <div>
              <h2>Please select some spaces!</h2>
            </div>
          ) : null}
          {reports.state === 'COMPLETE' && reports.data.length > 0 ? reports.data.map(report => (
            <Report
              key={report.id}
              report={report}
              reportData={calculatedReportData[report.id]}
            />
          )) : null}
          <pre>{JSON.stringify(reports, null, 2)}</pre>
        </div>
      </AppPane>
    </AppFrame>
  );
}

export default connect(state => {
  return {
    spaceIds: state.miscellaneous.exploreSpaceIds,
    spaces: state.spaces,
    reports: state.exploreData.calculations.reports,
    calculatedReportData: state.dashboards.calculatedReportData,
  };
}, dispatch => {
  return {
    onSpaceSearch(searchQuery) {
      dispatch(collectionSpacesFilter('search', searchQuery));
    },
    onSpaceChangeParent(parentId) {
      dispatch(collectionSpacesFilter('parent', parentId));
    },
  };
})(NewExploreDetail);
