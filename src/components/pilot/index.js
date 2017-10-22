import * as React from 'react';
import { connect } from 'react-redux';
import InputBox from '@density/ui-input-box';
import Card, { CardHeader, CardBody } from '@density/ui-card';
import Button from '@density/ui-button';
import CountUp from 'react-countup';

// TODO: start at random time in video
// 2 column, 5 row display
// Contiguous vs Algo
// Humans per hour
// Total # Humans seen


export class Pilot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {} = this.props;

    let doorways = [
      {
        id: 123,
        name: "Elevator A Installation",
        uptime: "99%",
        accuracy: "97%",
        humansPerHour: 140,
        totalHumansSeen: 1400
      },
      {
        id: 345,
        name: "Elevator B Installation",
        uptime: "99%",
        accuracy: "95%",
        humansPerHour: 20,
        totalHumansSeen: 2319
      },
    ]

    return <div className="pilot">
      <div className="pilot-container">

        {doorways.map(doorway => {
          return <div key={doorway.id}>
            <div className="doorway-list-header">
              <h2>{doorway.name}</h2>
            </div>
            <div className="doorway-list-row">
              <div className="doorway-list-item">
                <Card className="pilot-doorway-card">
                  <CardBody>
                    <p>Humans Per Hour: {doorway.humansPerHour}</p>
                    <p>Total Humans Seen: <CountUp start={0} end={doorway.totalHumansSeen} duration={1.5} /></p>
                  </CardBody>
                </Card>
              </div>
              <div className="doorway-list-item">
                <Card className="pilot-doorway-card">
                  <CardBody>
                    <p>{doorway.accuracy} accuracy</p>
                    <p>{doorway.uptime} uptime</p>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        })}
      </div>
    </div>;
  }
}

export default connect(state => {
  return {};
}, dispatch => {
  
})(Pilot);
