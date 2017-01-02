import moment from 'moment';
import React from 'react';
import { Button, Popover, Position } from '@blueprintjs/core';
import { DateRangePicker } from '@blueprintjs/datetime';

const DensityDateRangePicker = React.createClass({
  getInitialState: function () {
    return {
      startDate: null,
      endDate: null
    }
  },

  getDisplayString: function () {
    return (this.props.startDate && this.props.endDate) ? 
      moment.utc(this.props.startDate).format('L') + " - " + moment.utc(this.props.endDate).format('L')
      : '';
  },

  render: function () {
    const cmp = this;
    const maxDate = new Date();
    const content = (
      <div>
        <DateRangePicker
          defaultValue={[cmp.props.startDate, cmp.props.endDate]}
          maxDate={maxDate}
          onChange={value => {
            cmp.setState({ startDate: value[0], endDate: value[1] });
          }}
          shortcuts={false}
        />
        <Button 
          text="Select Date"
          className="pt-intent-primary pt-popover-dismiss"
          style={{ width: '100%', padding: '6px 0' }}
          onClick={() => {
            cmp.props.onChange([moment(cmp.state.startDate).hours(0).minutes(0).seconds(0), moment(cmp.state.endDate).hours(0).minutes(0).seconds(0)]);
          }}
        />
      </div>
    );

    return (
      <Popover 
        content={content} 
        useSmartPositioning={true}
      >
        <Button 
          text={cmp.getDisplayString()} 
        />
      </Popover>
    );
  }
});

export default DensityDateRangePicker;