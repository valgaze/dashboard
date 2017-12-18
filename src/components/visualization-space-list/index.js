import * as React from 'react';
import { connect } from 'react-redux';
import ErrorBar from '../error-bar/index';

import collectionSpacesFilter from '../../actions/collection/spaces/filter';

import InputBox from '@density/ui-input-box';
import SpaceCard from '../visualization-space-card/index';

import filterCollection from '../../helpers/filter-collection/index';
const spaceFilter = filterCollection({fields: ['name']});

export function SpaceList({
  spaces,

  onSpaceSearch,
}) {
  return <div className="space-list">
    {/* Show errors in the spaces collection. */}
    <ErrorBar message={spaces.error} showRefresh />

    <div className="space-list-container">
      <div className="space-list-header">
        <h2 className="space-list-header-text">Spaces</h2>
        <InputBox
          className="space-list-search-box"
          placeholder="Filter Spaces ..."
          value={spaces.filters.search}
          onChange={e => onSpaceSearch(e.target.value)}
        />
      </div>

      <div className="space-list-row">
        {spaceFilter(spaces.data, spaces.filters.search).map(space => {
          return <div className="space-list-item" key={space.id}>
            <SpaceCard
              space={space}
              events={spaces.events[space.id]}
              onClick={() => window.location.href = `#/insights/spaces/${space.id}`}
            />
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
})(SpaceList);
