import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';


export function SensorsList({
  sensors,
  spaces
}) {
  let sortedSensors = sensors.data.sort(function(a, b){
   if (a.status < b.status)
      return -1;
    if (a.status > b.status)
      return 1;
    return 0;
  })
  return <div className="sensors-list">
    {/* Show errors in the spaces collection. */}

    <div className="sensors-list-container">
      <div className="sensors-list-header">
        <h2 className="sensors-list-header-text">DPU Status</h2>
      </div>
      <div className="sensors-list-body">
        <table className="sensors-list-table">
          <thead>
            <tr key="1">
              <td>Serial Number</td>
              <td>Status</td>
              <td>Last Heartbeat</td>
              <td>Doorway</td>
              <td>Space(s)</td>
            </tr>
          </thead>
          <tbody>
          {sortedSensors.map(sensor => {
            
            const filteredSpaces = spaces.data.filter(space => {
              return space.doorways.map(doorway => {
                return doorway.id
              }).includes(sensor.doorwayId)
            })

            return <tr key={sensor.serialNumber}>
              <td>{sensor.serialNumber}</td>
              <td className={`sensor-status-${sensor.status}`}>{sensor.status}</td>
              <td>{moment(sensor.lastHeartbeat).format("MMM D, h:mma")}</td>
              <td>{sensor.doorwayName}</td>
              <td>{ filteredSpaces.map(space => {
                return <span className="spaceItem" key={space.id}>{space.name}</span>
              }) }
              </td>
            </tr>;
          })}
          </tbody>
        </table>
      </div>
    </div>
  </div>;
}

export default connect((state: any) => {
  return {
    sensors: state.sensors,
    spaces: state.spaces
  };
}, dispatch => {
  return {
  };
})(SensorsList);
