import moment from 'moment';
import React from 'react';
import { Button, Popover, Position } from '@blueprintjs/core';
import { DatePicker } from '@blueprintjs/datetime';

const DensityDatePicker = React.createClass({
  getInitialState: function () {
    return {
      date: null,
      isOpen: false,
      clickedInPopover: false
    }
  },

  getDisplayString: function () {
    return (this.props.date) ? 
      moment.utc(this.props.date).format('L')
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
        <DatePicker
          defaultValue={cmp.props.date}
          maxDate={maxDate}
          onChange={value => {
            cmp.setState({ date: value });
          }}
          shortcuts={false}
        />
        <Button 
          text="Select Date"
          className="pt-intent-primary"
          style={{ width: '100%', padding: '6px 0' }}
          onClick={() => {
            cmp.props.onChange(moment(cmp.state.date).hours(0).minutes(0).seconds(0));
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

export default DensityDatePicker;