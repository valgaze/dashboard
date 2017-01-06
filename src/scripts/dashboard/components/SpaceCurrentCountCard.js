import React from 'react';
import {connect} from 'react-redux';

import {spacesResetToZeroCount, spacesToggleEditCount, spacesChangeCount, spacesSaveTempCount} from 'dashboard/actions/spaces';

function SpaceCurrentCountCard({
  space, 
  editingCurrentCount, 
  tempCount, 
  onToggleEditCount,
  onDecreaseCount,
  onIncreaseCount,
  onSaveCount,
  onResetToZero
}) {
  return (
    <div>
      <div className="card-top-header">
        <span className="title">Current Count</span>
        <span className="action" onClick={onToggleEditCount(editingCurrentCount)}>{editingCurrentCount ? "Cancel" : "Edit count" }</span> 
        <span className={editingCurrentCount ? "action save-action" : "hide"} onClick={onSaveCount}>Save</span>
      </div>
      <div className="card current-count-card">
        <div className="card-body">
          <div className="count">
            <button className={editingCurrentCount ? "card circle-button" : "hide"} onClick={onDecreaseCount}>
              <i className="icon icon-minus"></i>
            </button>
            <div className="current-count" contentEditable={editingCurrentCount}>{editingCurrentCount ? tempCount : space.current_count}</div>
            <button className={editingCurrentCount ? "card circle-button" : "hide"} onClick={onIncreaseCount}>
              <i className="icon icon-add"></i>
            </button>
          </div>
          <div className="reset-to-zero">
            <div className={editingCurrentCount ? "action" : "hide"} onClick={onResetToZero}>Reset to zero</div>
          </div>
        </div>
      </div>  
    </div>
  )
}

const mapStateToProps = state => ({
  space: state.spaces.currentObj,
  editingCurrentCount: state.spaces.editingCurrentCount,
  tempCount: state.spaces.tempCount
});

const mapDispatchToProps = dispatch => ({
  onToggleEditCount: (editingCurrentCount) => () => {
    dispatch(spacesToggleEditCount(editingCurrentCount));
  },
  onResetToZero: () => {
    dispatch(spacesResetToZeroCount());
  },
  onIncreaseCount: () => {
    dispatch(spacesChangeCount(1));
  },
  onDecreaseCount: () => {
    dispatch(spacesChangeCount(-1));
  },
  onSaveCount: () => {
    dispatch(spacesSaveTempCount());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SpaceCurrentCountCard);