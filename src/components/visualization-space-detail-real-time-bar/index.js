import * as React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';

import formatCapacityPercentage from '../../helpers/format-capacity-percentage/index';
import SpaceUpdateModal from '../visualization-space-detail-space-update-modal/index';

import spaceResetCount from '../../actions/collection/spaces/reset-count';

export function VisualizationSpaceDetailRealTimeBar({
  space,
  activeModal,

  onOpenModal,
  onCloseModal,
  onResetSpace,
}) {
  return <div className="visualization-space-detail-real-time-bar-container">
    <div className="visualization-space-detail-real-time-bar">
      <div className="visualization-space-detail-real-time-bar-count">
        <span className={classnames('visualization-space-detail-real-time-bar-count-label', {
          singular: space.currentCount === 1,
        })}>{space.currentCount}</span>
        <span
          className="visualization-space-detail-real-time-bar-count-update"
          onClick={() => onOpenModal('update-space-count', {space})}
        >Update Count</span>
      </div>

      {space.capacity ? <div className="visualization-space-detail-real-time-bar-capacity">
        {formatCapacityPercentage(space.currentCount, space.capacity)}
      </div> : null}

      {/* Show space count update modal when the flag is set */}
      {activeModal.name === 'update-space-count' ? <SpaceUpdateModal
        space={activeModal.data.space}
        onDismiss={onCloseModal}
        onSubmit={newCount => onResetSpace(space, newCount)}
      /> : null}
    </div>
  </div>
}

export default connect((state, props) => {
  return {
    space: props.space,
    activeModal: state.activeModal,
  };
}, dispatch => {
  return {
    onOpenModal(name, data) {
      dispatch(showModal(name, data));
    },
    onCloseModal() {
      dispatch(hideModal());
    },
    onResetSpace(space, newCount) {
      dispatch(spaceResetCount(space, newCount)).then(ok => {
        ok && dispatch(hideModal());
      });
    }
  };
})(VisualizationSpaceDetailRealTimeBar);
