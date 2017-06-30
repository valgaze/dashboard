import * as React from 'react';
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

export function EnvironmentDoorwayItem({doorway, onClickDetails, connectDragSource}) {
  return connectDragSource(<div className="environment-doorway-item">
    {doorway.name}
    <div
      className="environment-doorway-item-details"
      onClick={onClickDetails}
    >...</div>
  </div>);
}

export default dragSource(EnvironmentDoorwayItem);
