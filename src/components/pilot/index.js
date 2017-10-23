import * as React from 'react';
import { connect } from 'react-redux';
import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';

import Card, { CardBody } from '@density/ui-card';


export function Pilot({
  pilot
}) {
  return <div className="pilot">
    <div className="pilot-container">

      {pilot.doorways.map(doorway => {
        return <div key={doorway.id}>
          <div className="doorway-list-header">
            <h2>{doorway.name}</h2>
          </div>
          <div className="doorway-list-row">
            <div className="doorway-list-item">
              <Card className="pilot-doorway-card">
                <CardBody>
                <Video className="video-player" autoPlay loop muted
                  controls={['PlayPause', 'Seek']}>
                    <source src={doorway.rawVideo} type="video/mp4" />
                </Video>
                  <h3>Humans Per Hour: {doorway.humansPerHour === 0 ? "--" : doorway.humansPerHour } h/hr</h3>
                  <h3>Total Humans Seen: {doorway.totalHumansSeen === 0 ? "--" : doorway.totalHumansSeen } humans</h3>
                </CardBody>
              </Card>
            </div>
            <div className="doorway-list-item">
              <Card className="pilot-doorway-card">
                <CardBody>
                  <Video className="video-player" autoPlay loop muted
                    controls={['PlayPause', 'Seek']}>
                      <source src={doorway.algoVideo} type="video/mp4" />
                  </Video>
                  <h3>Doorway Accuracy: {doorway.accuracy}</h3>
                  <h3>Sensor Uptime: {doorway.uptime}</h3>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      })}
    </div>
  </div>;
}

export default connect(state => {
  return {
    pilot: state.pilot
  };
}, dispatch => {
  return {};
})(Pilot);
