import * as React from 'react';
import { connect } from 'react-redux';
import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';

import Card, { CardBody } from '@density/ui-card';


export function Pilot({
  pilot
}) {
  function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
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
                  <h2>What our sensor sees</h2>
                  <Video className="video-player" autoPlay loop muted
                    controls={['PlayPause', 'Seek']}>
                      <source src={doorway.rawVideo} type="video/mp4" />
                  </Video>
                  <h2>Sensor Stats:</h2>
                  <h3>Humans Per Hour: <strong>{doorway.humansPerHour === 0 ? "--" : doorway.humansPerHour } h/hr</strong></h3>
                  <h3>Total Number of Events Since {doorway.firstEvent}: <strong>{doorway.totalHumansSeen === 0 ? "--" : numberWithCommas(doorway.totalHumansSeen) }</strong></h3>
                </CardBody>
              </Card>
            </div>
            <div className="doorway-list-item">
              <Card className="pilot-doorway-card">
                <CardBody>
                  <h2>What our algorithm sees</h2>
                  <Video className="video-player" autoPlay loop muted
                    controls={['PlayPause', 'Seek']}>
                      <source src={doorway.algoVideo} type="video/mp4" />
                  </Video>
                  <h2>Metro v0.1.15 Stats:</h2>
                  <h3>Doorway Accuracy: <strong>{doorway.accuracy}</strong></h3>
                  <h3>Device Uptime: <strong>{doorway.uptime}</strong></h3>
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
