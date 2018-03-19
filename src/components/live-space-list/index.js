import * as React from 'react';
import { connect } from 'react-redux';
import ErrorBar from '../error-bar/index';

import collectionSpacesFilter from '../../actions/collection/spaces/filter';

import InputBox from '@density/ui-input-box';
import SpaceCard from '../live-space-card/index';

import { CONNECTION_STATES } from '../../helpers/websocket-event-pusher/index';

import filterCollection from '../../helpers/filter-collection/index';
const spaceFilter = filterCollection({fields: ['name']});

export function LiveSpaceList({
  spaces,
  eventPusherStatus,

  onSpaceSearch,
}) {
  return <div className="live-space-list">
    {/* Show errors in the spaces collection. */}
    <ErrorBar message={spaces.error} showRefresh />

    <div className="live-space-list-container">
      <div className="live-space-list-header">
        <h2 className="live-space-list-header-text">
          Spaces
          <span className="live-space-list-live-indicator-tag">
            {(function(status) {
              switch (status) {
                case CONNECTION_STATES.ERROR:
                  return 'ERROR';
                case CONNECTION_STATES.WAITING_FOR_SOCKET_URL:
                case CONNECTION_STATES.CONNECTING:
                  return 'CONNECTING';
                case CONNECTION_STATES.CONNECTED:
                  return 'LIVE';
                default:
                  return 'OFFLINE';
              }
            })(eventPusherStatus.status)}
            <i className={`status-${eventPusherStatus.status.toLowerCase()}`} />
          </span>
        </h2>
        <InputBox
          type="text"
          className="live-space-list-search-box"
          placeholder="Filter Spaces ..."
          value={spaces.filters.search}
          onChange={e => onSpaceSearch(e.target.value)}
        />
      </div>

      <div className="live-space-list-row">
        {spaceFilter(spaces.data, spaces.filters.search).map(space => {
          return <div className="live-space-list-item" key={space.id}>
            <SpaceCard
              space={space}
              events={spaces.events[space.id]}
              onClick={() => window.location.href = `#/spaces/insights/${space.id}`}
              onClickRealtimeChartFullScreen={() => window.location.href = `#/spaces/live/${space.id}` }
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
    eventPusherStatus: state.eventPusherStatus,
  };
}, dispatch => {
  return {
    onSpaceSearch(searchQuery) {
      dispatch(collectionSpacesFilter('search', searchQuery));
    },
  };
})(LiveSpaceList);
