import * as React from 'react';
import { connect } from 'react-redux';

export function SpaceDetail({
  space,
}) {
  if (space) {
    return <div className="space-detail">
      Show some details! {space.name}
    </div>;
  } else {
    return <span>This space doesn't exist.</span>;
  }
}

export default connect(state => {
  return {
    space: state.spaces.data.find(space => space.id === state.spaces.selected),
  };
}, dispatch => {
  return {};
})(SpaceDetail);
