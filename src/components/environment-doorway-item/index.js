import * as React from 'react';
import classnames from 'classnames';
import { DragSource } from 'react-dnd';

const doorwaySource = {
  beginDrag(props) {
    return {doorway: props.doorway};
  },
};

const dragSource = DragSource('doorway', doorwaySource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))

export function EnvironmentDoorwayItem({doorway, onClickDetails, connectDragSource, isDragging}) {
  return connectDragSource(<div className={classnames(
    'environment-doorway-item',
    isDragging ? 'environment-doorway-item-dragging' : null
  )}>
    {doorway.name}
    <div
      className="environment-doorway-item-details"
      onClick={onClickDetails}
    >...</div>
  </div>);
}

export default dragSource(EnvironmentDoorwayItem);
