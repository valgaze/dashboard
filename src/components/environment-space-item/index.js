import * as React from 'react';
import { DropTarget } from 'react-dnd';
import classnames from 'classnames';

import Card, { CardHeader, CardBody } from '@density/ui-card';

import { IconDragDrop, IconSwitch } from '../icons/index';

const doorwayTarget = {
  // When a doorway is dropped onto the space card, then call the `onDoorwayDropped` callback.
  drop(props, monitor, component) {
    props.onDoorwayDropped(monitor.getItem().doorway);
  },
};

const dropTarget = DropTarget('doorway', doorwayTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOverCurrent: monitor.isOver({ shallow: true }),
}));

export function EnvironmentSpaceItem({
  space,
  links,
  doorways,

  connectDropTarget,
  isOverCurrent,

  onDoorwayDropped,
  onDoorwayLinkDeleted,
  onSensorPlacementChange,
  onClickDetails,
}) {
  return connectDropTarget(<div className="environment-space-item">
    <Card>
      <CardHeader size="small" className="environment-space-item-header">
        <div className="environment-space-item-name">{space.name}</div>
        <div className="environment-space-item-details" onClick={onClickDetails}>&#xe922;</div>
      </CardHeader>
      <CardBody className={classnames(
        'environment-space-item-body',
        doorways.length === 0 ? 'empty' : null,
        isOverCurrent ? 'is-dropping' : null
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
            <IconDragDrop className="environment-space-item-empty-state-icon" />
            Drag and Drop Doorways Here
          </span> : null}
        </ul>
      </CardBody>
    </Card>
  </div>);
}

export default dropTarget(EnvironmentSpaceItem);
