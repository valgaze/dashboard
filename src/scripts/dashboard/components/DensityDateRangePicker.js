import moment from 'moment';
import React from 'react';
import { Button, Popover, Position } from '@blueprintjs/core';
import { DateRangePicker } from '@blueprintjs/datetime';

const DensityDateRangePicker = React.createClass({
  getInitialState: function () {
    return {
      startDate: null,
      endDate: null,
      isOpen: false,
      clickedInPopover: false
    }
  },

  getDisplayString: function () {
    return (this.props.startDate && this.props.endDate) ? 
      moment.utc(this.props.startDate).format('L') + " - " + moment.utc(this.props.endDate).format('L')
      : '';
  },

  clickListener: function () {
    if (this.state.clickedInPopover) {
      this.setState({ clickedInPopover: false });
    } else {
      this.setState({ clickedInPopover: false, isOpen: false });
    }
  },

  openOverlay: function () {
    this.setState({ 
      isOpen: true,
      clickedInPopover: true // to prevent initial click from closing
    });
    window.addEventListener('click', this.clickListener);
  },

  closeOverlay: function () {
    window.removeEventListener('click', this.clickListener);
    this.setState({ isOpen: false });
  },

  render: function () {
    const cmp = this;
    const maxDate = new Date();
    const content = (
      <div onClick={event => { cmp.setState({ clickedInPopover: true }); }}>
        <DateRangePicker
          defaultValue={[cmp.state.startDate, cmp.state.endDate]}
          maxDate={maxDate}
          initialMonth={new Date()}
          onChange={value => {
            cmp.setState({ startDate: value[0], endDate: value[1] });
          }}
          shortcuts={false}
        />
        <Button 
          text="Select Date"
          className="pt-intent-primary"
          style={{ width: '100%', padding: '6px 0' }}
          onClick={() => {
            cmp.props.onChange([moment(cmp.state.startDate).hours(0).minutes(0).seconds(0), moment(cmp.state.endDate).hours(0).minutes(0).seconds(0)]);
            cmp.setState({isOpen: false});
          }}
        />
      </div>
    );

    return (
      <Popover 
        content={content} 
        position={Position.BOTTOM} 
        isOpen={cmp.state.isOpen}
      >
        <Button 
          text={cmp.getDisplayString()} 
          onClick={cmp.openOverlay}
        />
      </Popover>
    );
  }
});

export default DensityDateRangePicker;