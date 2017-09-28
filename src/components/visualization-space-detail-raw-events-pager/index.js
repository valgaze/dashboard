import * as React from 'react';

import InputBox from '@density/ui-input-box';
import PagerButtonGroup from '@density/ui-pager-button-group';

export default class VisualizationSpaceDetailRawEventsPager extends React.Component {
  constructor(props) {
    super(props);
    this.state = { textPage: false };
  }
  render() {
    const {
      page,
      totalPages,
      totalEvents,
      onChange,
    } = this.props;

    return <div className="visualization-space-detail-raw-events-pager">
      <div className="visualization-space-detail-raw-events-pager-total">
        {totalEvents ? `${totalEvents} Events...` : null}
      </div>
      <div className="visualization-space-detail-raw-events-pager-picker">
        <span>Page</span>
        <InputBox
          type="text"
          value={this.state.textPage === false ? page : this.state.textPage}

          // As the user types, update the internal representation
          onChange={e => this.setState({textPage: e.target.value})}

          // When the user is finished typing, clear the internal representation and emit the
          // changed value.
          onBlur={() => {
            onChange(parseInt(this.state.textPage, 10));
            this.setState({textPage: false});
          }}
        />
        <span>of {totalPages}</span>
      </div>
      <div className="visualization-space-detail-raw-events-pager-button-group">
        {/* <PagerButtonGroup showFirstLastButtons /> */}
      </div>
    </div>;
  }
}
