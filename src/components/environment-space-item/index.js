import * as React from 'react';
import { DropTarget } from 'react-dnd';
import classnames from 'classnames';

import Card, { CardHeader, CardBody } from '@density/ui-card';

import { IconDragDrop, IconSwitch } from '../icons/index';

const doorwayTarget = {
  // Handle dropping a doorway into a space.
  drop(props, monitor, component) {
    const item = monitor.getItem();
    if (item) {
      if (doorwayHasLinkToSpace(props.links, props.space, item.doorway)) {
        // The user tried to drop a doorway that is already linked to the given space. Show an error.
        props.onDoorwayDroppedAlreadyInSpace(item.doorway);
      } else {
        // The given doorway isn't in the space. Create a link between the dragged doorway and the
        // space the doroway has been dropped within.
        props.onDoorwayDropped(monitor.getItem().doorway);
      }
    }
  },
};

const dropTarget = DropTarget('doorway', doorwayTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  currentlyDraggedDoorway: monitor.getItem(),
}));

// Given a list of links, and a space/doorway, return the first link that attaches the space and
// doorway together. Used to see if a doorway can be dropped on a space when dragged overtop.
function doorwayHasLinkToSpace(links, space, doorway) {
  if (!doorway) {
    return false;
  } else {
    return links.find(link => link.spaceId === space.id && link.doorwayId === doorway.id);
  }
}

export function EnvironmentSpaceItem({
  space,
  links,
  doorways,

  connectDropTarget,
  isOverCurrent,
  currentlyDraggedDoorway,

  onDoorwayDropped,
  onDoorwayLinkDeleted,
  onSensorPlacementChange,
  onClickDetails,
}) {
  // If a doorway is currently being dragged, then render the drop target in a special way.
  const isDoorwayAlreadyLinkedToSpace = currentlyDraggedDoorway ?
    doorwayHasLinkToSpace(links, space, currentlyDraggedDoorway.doorway) :
    false;

  return connectDropTarget(<div className="environment-space-item">
    <Card>
      <CardHeader size="small" className="environment-space-item-header">
        <div className="environment-space-item-name">{space.name}</div>
        <div className="environment-space-item-details" onClick={onClickDetails}>&#xe922;</div>
      </CardHeader>
      <CardBody className={classnames(
        'environment-space-item-body',
        doorways.length === 0 ? 'empty' : null,
        isOverCurrent ? 'is-dropping' : null,
        isDoorwayAlreadyLinkedToSpace ? 'is-dropping-invalid' : null,
      )}>
        <ul className="environment-space-item-doorways">
          {doorways.map(doorway => {
            const link = links.find(i => i.doorwayId === doorway.id && i.spaceId === space.id);
            return <li key={doorway.id}>
              <span className="environment-space-item-doorways-name">{doorway.name}</span>
              <span className="environment-space-item-doorways-placement">
                <span className="environment-space-item-doorways-placement-label">
                  {link.sensorPlacement === 1 ? 'Sensor Inside' : 'Sensor Outside'}
                </span>
                <span
                  className="environment-space-item-doorways-placement-button"
                  onClick={() => onSensorPlacementChange(link)}
                ><IconSwitch /></span>
              </span>
              <span
                className="environment-space-item-doorways-delete"
                onClick={() => onDoorwayLinkDeleted(link)}
              />
            </li>
          })}

          {/* Empty state */}
          {doorways.length === 0 ? <span className="environment-space-item-body-empty">
            <span className="environment-space-item-empty-state-label-desktop">
              <IconDragDrop className="environment-space-item-empty-state-icon" />
              Drag and Drop Doorways Here
            </span>
            <span className="environment-space-item-empty-state-label-mobile">No Doorways linked to space</span>
          </span> : null}
        </ul>
      </CardBody>
    </Card>
  </div>);
}

export default dropTarget(EnvironmentSpaceItem);
