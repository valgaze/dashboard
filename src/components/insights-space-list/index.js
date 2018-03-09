import * as React from 'react';
import { connect } from 'react-redux';
import ErrorBar from '../error-bar/index';

import collectionSpacesFilter from '../../actions/collection/spaces/filter';

import InputBox from '@density/ui-input-box';

import filterCollection from '../../helpers/filter-collection/index';
const spaceFilter = filterCollection({fields: ['name']});

export function InsightsSpaceList({
  spaces,

  onSpaceSearch,
}) {
  return <div className="insights-space-list">
    {/* Show errors in the spaces collection. */}
    <ErrorBar message={spaces.error} showRefresh />

    <div className="insights-space-list-container">
      <div className="insights-space-list-header">
        <h2 className="insights-space-list-header-text">Insights</h2>
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
          </div>;
        })}
      </div>
    </div>
  </div>;
}

export default connect(state => {
  return {
    spaces: state.spaces,
  };
}, dispatch => {
  return {
    onSpaceSearch(searchQuery) {
      dispatch(collectionSpacesFilter('search', searchQuery));
    },
  };
})(InsightsSpaceList);
