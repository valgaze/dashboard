import * as React from 'react';
import { DragSource, DropTarget } from 'react-dnd';

import { connect } from 'react-redux';

function SpaceItemComponent({
  space,

  isDragging,
  connectDragSource,
  connectDropTarget,
}) {
  if (space) {
    return connectDragSource(
      <div style={{background: 'red', width: 500, height: 200, opacity: isDragging ? 0.5 : 1}}>
        <div className="space-list-item" key={space.id}>
          <SpaceItem id={space.id} />
          <h1>{space.name}</h1>
          <ul>
            <li>Timezone: {space.timezone}</li>
            <li>Count: {space.currentCount}</li>
            <li>Capacity: {space.capacity || 'N/A'}</li>
          </ul>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

const cardTarget = {
  drop(props, monitor, component) {
    // console.log('drop', props, monitor, component);
    props.onMove(monitor.getItem());
  },
};

const cardSource = {
  beginDrag(props) {
    return {id: props.space && props.space.id};
  },
  endDrag(props) {
    console.log('drag end on source');
  }
};

const dropTarget = DropTarget('my-thing', cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}));

const dragSource = DragSource('my-thing', cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))

const SpaceItem = dragSource(SpaceItemComponent);

const SpaceDragAcceptor = dropTarget(function({connectDropTarget}) {
  return connectDropTarget(
    <div style={{width: 200, height: 200, border: `2px dotted green`}}>
      Accept space drag here.
    </div>
  );
});

export function SpaceList({spaces}) {
  return <div className="space-list">
    <SpaceDragAcceptor onMove={id => console.log('space moved', id)} />
    {spaces.data.map(space => {
      return <div className="space-list-item" key={space.id}>
        <SpaceItem space={space} />
      </div>;
    })}
  </div>;
}

export default connect(state => {
  return {
    spaces: state.spaces,
  };
}, dispatch => {
  return {};
})(SpaceList);
