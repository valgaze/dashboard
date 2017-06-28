import * as React from 'react';
import { DropTarget } from 'react-dnd';

const doorwayTarget = {
  // When a doorway is dropped onto the space card, then call the `onDoorwayDropped` callback.
  drop(props, monitor, component) {
    props.onDoorwayDropped(monitor.getItem().doorway);
  },
};

const dropTarget = DropTarget('doorway', doorwayTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}));

const EnvironmentSpaceDropItem = dropTarget(function({connectDropTarget}) {
  return connectDropTarget(<div className="environment-space-item-doorway-drop" />);
});

export default function EnvironmentSpaceItem({
  space,
  links,
  doorways,
  onDoorwayDropped,
  onDoorwayLinkDeleted,
}) {
  return <div className="environment-space-item">
    <h2>{space.name}</h2>

    <ul className="environment-space-item-doorways">
      {doorways.map(doorway => {
        const link = links.find(i => i.doorwayId === doorway.id && i.spaceId === space.id);
        return <li key={doorway.id}>
          {doorway.name}
          <span onClick={() => onDoorwayLinkDeleted(link)}>&times;</span>
        </li>
      })}
    </ul>

    {/* Allow users to drop doorways in the space to add them to the space */}
    <EnvironmentSpaceDropItem onDoorwayDropped={onDoorwayDropped} />
  </div>;
}
