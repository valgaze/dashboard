import * as React from 'react';

import { connect } from 'react-redux';

export function SpaceList({spaces}) {
  return <div className="space-list">
    {spaces.data.map(space => {
      return <div className="space-list-item" key={space.id}>
        <h1>{space.name}</h1>
        <ul>
          <li>Timezone: {space.timezone}</li>
          <li>Count: {space.currentCount}</li>
          <li>Capacity: {space.capacity || 'N/A'}</li>
        </ul>
      </div>;
    })}
  </div>;
}

export default connect(state => {
  return {
    spaces: state.spaces,
  };
}, dispatch => {
  return {};
})(SpaceList);
