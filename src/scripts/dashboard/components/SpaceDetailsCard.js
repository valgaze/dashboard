import React from 'react';
import {connect} from 'react-redux';

import {spacesFormFieldUpdate, spacesToggleEditDetails, spacesUpdate} from 'dashboard/actions/spaces';

function SpaceDetailsCard({
  space,
  editingSpaceDetails,
  tempName, 
  tempDailyReset,
  onToggleEditDetails,
  onSaveDetails,
  onUpdateFormField
}) {
  return (
    <div>
      <div className="card-top-header">
        <span className="title">Space Details</span>
        <span className="action" onClick={onToggleEditDetails(editingSpaceDetails)}>{editingSpaceDetails ? "Cancel" : "Edit details" }</span> 
        <span className={editingSpaceDetails ? "action save-action" : "hide"} onClick={onSaveDetails}>Save</span>
      </div>
      <div className="card details-card">
        <table className="table striped">
          <tbody>
            <tr>
              <td>Name</td>
              <td>
                <input type="text"
                  className={editingSpaceDetails ? "input editing" : "input"} 
                  disabled={!editingSpaceDetails} 
                  value={editingSpaceDetails ? tempName : (space.name || "" )}
                  onChange={onUpdateFormField('tempName')}
                />
              </td>
            </tr>
            <tr>
              <td>ID</td>
              <td>
                <input type="text"
                  className="input"
                  disabled={true}
                  value={space.id || ""}
                />
              </td>
            </tr>
            <tr>
              <td>Time Zone</td>
              <td>
                <input type="text"
                  className="input"
                  disabled={true}
                  value={space.timezone || ""}
                />
              </td>
            </tr>
            <tr>
              <td>Reset Time</td>
              <td>
                <input type="text"
                  className={editingSpaceDetails ? "input editing" : "input"} 
                  disabled={!editingSpaceDetails} 
                  value={editingSpaceDetails ? tempDailyReset : (space.daily_reset || "")}
                  onChange={onUpdateFormField('tempDailyReset')}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>  
    </div>
  )
}

const mapStateToProps = state => ({
  space: state.spaces.currentObj,
  editingSpaceDetails: state.spaces.editingSpaceDetails,
  tempName: state.spaces.tempName,
  tempDailyReset: state.spaces.tempDailyReset
});

const mapDispatchToProps = dispatch => ({
  onUpdateFormField: field => event => {
    dispatch(spacesFormFieldUpdate(field, event.target.value));
  },
  onToggleEditDetails: (editingSpaceDetails) => () => {
    dispatch(spacesToggleEditDetails(editingSpaceDetails));
  },
  onSaveDetails: () => {
    dispatch(spacesUpdate());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SpaceDetailsCard);