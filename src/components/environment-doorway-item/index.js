import * as React from 'react';
import { DragSource } from 'react-dnd';

const doorwaySource = {
  beginDrag(props) {
    return {doorway: props.doorway};
  },
  endDrag(props) {
    console.log('drag end on source');
  },
};

const dragSource = DragSource('doorway', doorwaySource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))

export function EnvironmentDoorwayItem({doorway, connectDragSource}) {
  return connectDragSource(<div className="environment-doorway-item">
    {doorway.name}
  </div>);
}

export default dragSource(EnvironmentDoorwayItem);
