import React from 'react';
import {connect} from 'react-redux';

import {eventsSimulateEvent} from 'dashboard/actions/events';
import {DensityToaster} from 'dashboard/components/DensityToaster';

function SpaceDoorwaysCard({
  space,
  onSimulateEvent
}) {
  return (
    <div>
      <div className="card-top-header">
        <span className="title">Doorways</span>
      </div>
      <div className="card">
        <table className="table striped">
          <thead>
            <tr>
              <td>Name</td>
              <td className="mobile-hide">ID</td>
              <td>Simulate Event</td>
            </tr>
          </thead>
          <tbody>
            {space.doorways && space.doorways.map(function(doorway, i) {
              return (
                <tr key={doorway.doorway_id}>
                  <td>{doorway.name}</td>
                  <td className="mobile-hide">{doorway.doorway_id}</td>
                  <td className="simulate-event-buttons">
                    <button className="card circle-button" onClick={onSimulateEvent(doorway.doorway_id, -1, doorway.sensor_placement)}>
                      <i className="icon icon-minus"></i>
                    </button>
                    <button className="card circle-button" onClick={onSimulateEvent(doorway.doorway_id, 1, doorway.sensor_placement)}>
                      <i className="icon icon-add"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  space: ownProps.space
});

const mapDispatchToProps = dispatch => ({
  onSimulateEvent: (doorwayId, direction, sensorPlacement) => () => {
    var simulationDirection = direction==1 ? "entrance" : "exit";
    DensityToaster.show({ message: `Simulating ${simulationDirection}...`, timeout: 2000, className: "pt-intent-primary" });
    dispatch(eventsSimulateEvent(doorwayId, direction, sensorPlacement));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SpaceDoorwaysCard);