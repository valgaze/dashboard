import * as React from 'react';
import { connect } from 'react-redux';

import SpaceCard from '../space-card/index';

export function SpaceList({spaces}) {
  return <div className="space-list">
    <div className="space-list-row">
      {spaces.data.map(space => {
        return <div className="space-list-item" key={space.id}>
          <a href={`#/visualization/spaces/${space.id}`}>Go to details for {space.id}</a>
          <SpaceCard space={space} events={spaces.events[space.id]} />
        </div>;
      })}
    </div>
  </div>;
}

export default connect(state => {
  return {
    spaces: state.spaces,
  };
}, dispatch => {
  return {};
})(SpaceList);
