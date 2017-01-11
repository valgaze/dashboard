import moment from 'moment';
import React from 'react';
import { Button, Popover, Position } from '@blueprintjs/core';
import { DatePicker } from '@blueprintjs/datetime';

const DensityDatePicker = React.createClass({
  getInitialState: function () {
    return {
      date: this.props.date
    }
  },

  getDisplayString: function () {
    return (this.props.date) ? 
      moment.utc(this.props.date).format('L')
      : '';
  },

  render: function () {
    const cmp = this;
    const maxDate = new Date();
    const content = (
      <div>
        <DatePicker
          defaultValue={cmp.props.date}
          popoverPosition={Position.BOTTOM}
          maxDate={maxDate}
          onChange={value => {
            cmp.setState({ date: value });
          }}
          shortcuts={false}
        />
        <Button 
          text="Select Date"
          className="pt-intent-primary pt-popover-dismiss"
          style={{ width: '100%', padding: '6px 0' }}
          onClick={() => {
            cmp.props.onChange(moment(cmp.state.date).hours(0).minutes(0).seconds(0));
          }}
        />
      </div>
    );

    return (
      <Popover 
        content={content}
        useSmartPositioning={true}
      >
        <Button text={cmp.getDisplayString()} />
      </Popover>
    );
  }
});

export default DensityDatePicker;