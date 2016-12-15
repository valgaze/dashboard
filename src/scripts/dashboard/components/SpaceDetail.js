import React from 'react';
import {connect} from 'react-redux';

import Appbar from 'dashboard/components/Appbar';
import Sidebar from 'dashboard/components/Sidebar';
import {spacesToggleEditCount, spacesIncreaseCount, spacesDecreaseCount, spacesSaveTempCount} from 'dashboard/actions/spaces';

function SpaceDetail({
  space, 
  editingCurrentCount, 
  tempCount, 
  onToggleEditCount,
  onDecreaseCount,
  onIncreaseCount,
  onSaveCount
}) {
  return (
    <div>
      <Appbar />
      <div className="row">
        <Sidebar />
        <div className="col-xs-24 col-md-20">
          <div className="space-detail-section">
            <div className="row">
              <div className="col-xs-20 off-xs-2 col-md-22 off-md-1">
                <h1><span className="breadcrumb">Spaces /</span> {space.name}</h1>
                <div className="count-and-detail-section">
                  <div className="row">
                    <div className="col-xs-20 off-xs-2 col-md-12 off-md-0">
                      <div className="card-top-header">
                        <span className="title">Current Count</span>
                        <span className="action" onClick={onToggleEditCount(editingCurrentCount)}>{editingCurrentCount ? "Cancel" : "Edit count" }</span> 
                        <span className={editingCurrentCount ? "action save-action" : "hide"} onClick={onSaveCount}>Save</span>
                      </div>
                      <div className="card current-count-card">
                        <div className="card-body">
                          <button className={editingCurrentCount ? "card circle-button" : "hide"} onClick={onDecreaseCount}>
                            <i className="icon icon-minus"></i>
                          </button>
                          <div className="current-count">{editingCurrentCount ? tempCount : space.current_count}</div>
                          <button className={editingCurrentCount ? "card circle-button" : "hide"} onClick={onIncreaseCount}>
                            <i className="icon icon-add"></i>
                          </button>
                        </div>
                      </div>  
                    </div>
                    <div className="col-xs-20 off-xs-2 col-md-12 off-md-0">
                      <div className="card-top-header">
                        <span className="title">Space Details</span>
                        <span className="action">Edit details</span>
                      </div>
                      <div className="card">
                        <table className="table striped">
                          <tbody>
                            <tr>
                              <td>Name</td>
                              <td>{space.name}</td>
                            </tr>
                            <tr>
                              <td>ID</td>
                              <td>{space.id}</td>
                            </tr>
                            <tr>
                              <td>Time Zone</td>
                              <td>{space.timezone}</td>
                            </tr>
                            <tr>
                              <td>Reset Time</td>
                              <td>N/A</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>  
                    </div>
                  </div>
                </div>
                <div className="doorways-section">
                  <div className="card-top-header">
                    <span className="title">Doorways</span>
                  </div>
                  <div className="card">
                    <table className="table striped">
                      <thead>
                        <tr>
                          <td>Name</td>
                          <td>ID</td>
                          <td>Sensor Status</td>
                        </tr>
                      </thead>
                      <tbody>
                        {space.doorways && space.doorways.map(function(doorway, i) {
                          return (
                            <tr key={doorway.doorway_id}>
                              <td>{doorway.name}</td>
                              <td>{doorway.doorway_id}</td>
                              <td>Online</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>  
                </div>
              </div>
            </div>
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
  onIncreaseCount: () => {
    dispatch(spacesIncreaseCount());
  },
  onDecreaseCount: () => {
    dispatch(spacesDecreaseCount());
  },
  onSaveCount: () => {
    dispatch(spacesSaveTempCount());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SpaceDetail);