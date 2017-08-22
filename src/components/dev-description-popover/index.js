import * as React from 'react';
import Popover from '@density/ui-popover';
import Card, { CardBody } from '@density/ui-card';

export default class DescriptionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }
  render() {
    const popover = <Card className="dev-description-modal">
      <CardBody>{this.props.children}</CardBody>
    </Card>;

    return <Popover
      show={this.state.show}
      popover={popover}
      onDismiss={() => this.setState({show: false})}
    >
      <span
        className="dev-description-icon"
        onClick={() => this.setState({show: !this.state.show})}
      >&#xe91e;</span>
    </Popover>;
  }
}
