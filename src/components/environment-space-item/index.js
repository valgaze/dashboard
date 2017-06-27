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
  return connectDropTarget(<div>Drop a space here.</div>);
});

export default function EnvironmentSpaceItem({
  space,
  doorways,
  onDoorwayDropped,
}) {
  return <div className="environment-space-item">
    <h2>{space.name}</h2>

    {/* Allow users to drop doorways in the space to add them to the space */}
    <EnvironmentSpaceDropItem onDoorwayDropped={onDoorwayDropped} />

    <ul className="environment-space-item-doorways">
      {doorways.map(doorway => <li key={doorway.id}>{doorway.name}</li>)}
    </ul>
  </div>;
}
