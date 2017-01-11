import moment from 'moment';
import React from 'react';
import { Button, Popover, Position } from '@blueprintjs/core';
import { DateRangePicker } from '@blueprintjs/datetime';

const DensityDateRangePicker = React.createClass({
  getInitialState: function () {
    return {
      startDate: this.props.startDate,
      endDate: this.props.endDate
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

    function handleNullEndDate(startDate, endDate) {
      if (endDate == null) {
        endDate = startDate;
      } else if (startDate == null) {
        startDate = endDate;
      }
      return [startDate, endDate];
    }

    const content = (
      <div>
        <DateRangePicker
          defaultValue={[cmp.props.startDate, cmp.props.endDate]}
          popoverPosition={Position.BOTTOM}
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
            var date = handleNullEndDate(cmp.state.startDate, cmp.state.endDate);
            cmp.props.onChange([moment(date[0]).hours(0).minutes(0).seconds(0), moment(date[1]).hours(0).minutes(0).seconds(0)]);
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