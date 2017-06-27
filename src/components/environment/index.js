import * as React from 'react';
import { connect } from 'react-redux';

import EnvironmentSpaceItem from '../environment-space-item/index';
import EnvironmentDoorwayItem from '../environment-doorway-item/index';

// Given a space, use links to determine all doorways in the space and return them.
function allDoorwaysInSpace(doorways, links, space) {
  const linksForSpace = links.filter(link => link.spaceId === space.id);
  const doorwaysInLinks = linksForSpace.map(link => link.doorwayId);
  return doorways.filter(doorway => doorwaysInLinks.indexOf(doorway.id) >= 0);
}

export function Environment({
  spaces,
  doorways,
  links,
}) {
  return <div className="environment">
    <div className="space-column">
      <ul>
        {spaces.data.map(space => {
          return <EnvironmentSpaceItem
            key={space.id}
            space={space}
            doorways={allDoorwaysInSpace(doorways.data, links.data, space)}
            onDoorwayDropped={doorway => {
              console.log(`Doorway dropped on space ${space.id}: ${doorway.id}`);
            }}
          />;
        })}
      </ul>
    </div>
    <div className="doorway-column">
      {doorways.data.map(doorway => {
        return <EnvironmentDoorwayItem key={doorway.id} doorway={doorway} />;
      })}
    </div>
  </div>;
}

export default connect(state => {
  return {
    spaces: state.spaces,
    doorways: state.doorways,
    links: state.links,
  };
}, dispatch => {
  return {};
})(Environment);
