import * as React from 'react';
import { DropTarget } from 'react-dnd';
import classnames from 'classnames';

import Card, { CardHeader, CardBody } from '@density/ui-card';

const doorwayTarget = {
  // When a doorway is dropped onto the space card, then call the `onDoorwayDropped` callback.
  drop(props, monitor, component) {
    props.onDoorwayDropped(monitor.getItem().doorway);
  },
};

const dropTarget = DropTarget('doorway', doorwayTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}));

export function EnvironmentSpaceItem({
  space,
  links,
  doorways,

  connectDropTarget,

  onDoorwayDropped,
  onDoorwayLinkDeleted,
}) {
  return connectDropTarget(<div className="environment-space-item">
    <Card>
      <CardHeader className="environment-space-item-header">{space.name}</CardHeader>
      <CardBody className="environment-space-item-body">
        <ul className="environment-space-item-doorways">
          {doorways.map(doorway => {
            const link = links.find(i => i.doorwayId === doorway.id && i.spaceId === space.id);
            return <li key={doorway.id}>
              {doorway.name}
              <span
                className={classnames('environment-space-item-doorways-placement', {out: link.sensorPlacement === -1})}
                onClick={() => alert(link)}
              >{link.sensorPlacement === 1 ? 'INSIDE' : 'OUTSIDE'}</span>
              <span
                className="environment-space-item-doorways-delete"
                onClick={() => onDoorwayLinkDeleted(link)}
              >&times;</span>
            </li>
          })}
        </ul>
      </CardBody>
    </Card>
  </div>);
}

export default dropTarget(EnvironmentSpaceItem);
