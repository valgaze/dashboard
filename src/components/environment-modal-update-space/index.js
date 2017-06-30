import * as React from 'react';
import Modal from '@density/ui-modal';
import Card, { CardHeader, CardBody } from '@density/ui-card';

export default class EnvironmentModalUpdateSpace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.initialSpace.name || '',
      timezone: this.props.initialSpace.timezone || '',
      dailyReset: this.props.initialSpace.dailyReset || '',
      isEditing: false,
    };
  }
  render() {
    return <div className="environment-modal-create-space">
      <Modal onClickBackdrop={this.props.onDismiss}>
        <Card>
          <CardHeader>Space Details</CardHeader>
          <CardBody>
            <p onClick={() => this.setState({isEditing: true})}>Edit</p>
            <p onClick={this.props.onDelete}>Delete</p>

            <ul>
              <li>
                <label htmlFor="update-space-name">Space Name</label>
                <input
                  type="text"
                  id="update-space-name"
                  value={this.state.name}
                  onChange={e => this.setState({name: e.target.value})}
                />
              </li>
              <li>
                <label htmlFor="update-space-timezone">Time Zone</label>
                <input
                  type="text"
                  id="update-doorway-timezone"
                  value={this.state.timezone}
                  onChange={e => this.setState({timezone: e.target.value})}
                />
              </li>
              <li>
                <label htmlFor="update-space-daily-reset">Daily Reset</label>
                <input
                  type="text"
                  id="update-space-daily-reset"
                  value={this.state.dailyReset}
                  onChange={e => this.setState({dailyReset: e.target.value})}
                />
              </li>
              <li>
                <label htmlFor="display-space-doorways">Doorways</label>
                <div id="display-space-doorways">
                  {this.props.doorways.forEach(doorway => <code key={doorway.id}>{doorway.name}</code>)}
                </div>
              </li>
            </ul>

            <button
              disabled={this.state.name.length === 0}
              onClick={() => this.props.onSubmit(this.state)}
            >Save</button>
          </CardBody>
        </Card>
      </Modal>
    </div>;
  }
}
