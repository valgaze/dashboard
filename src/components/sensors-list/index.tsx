import React from 'react';
import { connect } from 'react-redux';

export function SensorsList({
  sensors,
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
      <div className="sensors-list-row">
        {sortedSensors.map(sensor => {
          return <div className="sensors-list-item" key={sensor.serial_number}>
            <div>{sensor.serialNumber}</div>
            <div>{sensor.doorwayName}</div>
            <div>{sensor.doorwayId}</div>
            <div className={`sensor-status-${sensor.status}`}>{sensor.status}</div>
            <div>{sensor.lastHeartbeat}</div>
          </div>;
        })}
      </div>
    </div>
  </div>;
}

export default connect((state: any) => {
  return {
    sensors: state.sensors,
  };
}, dispatch => {
  return {
  };
})(SensorsList);
