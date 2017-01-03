import React from 'react';
import {connect} from 'react-redux';
import c3 from 'c3';

let EventCount = React.createClass({

  drawChart: function(timestamps, counts) {
    let newTimestamps = ['Time'].concat(timestamps);
    let newCounts = ['Count'].concat(counts);
    this._chart = c3.generate({
      bindto: '#eventcountchart',
      tooltip: {
        show: true
      },
      data: {
        x: 'Time',
        y: 'Count',
        colors: {
          'Count': '#CBCFD6',
        },
        columns: [
          newTimestamps,
          newCounts,
        ],
        type: 'area-step',
        labels: false
      },
      legend: {
        hide: true
      },
      axis: {
        y: {
          show: true
        },
        x: {
          type: 'timeseries',
          label: {
            show: false
          },
          height: 50,
          tick: {
            fit: false,
            format: '%-I:%M %p',
            outer: false
          }
        }
      }
    });
  },

  updateChart: function(timestamps, counts) {
    let newTimestamps = ['Time'].concat(timestamps);
    let newCounts = ['Count'].concat(counts);
    this._chart.load({
      columns: [
      newTimestamps,
      newCounts
      ]
    });
  },
  
  componentDidMount: function() {
    this.drawChart(this.props.timestamps, this.props.counts);
  },

  componentDidUpdate: function () {
    this.updateChart(this.props.timestamps, this.props.counts);
  },

  render: function() {
    return (
      <div>
      <div id="eventcountchart"></div>
      </div>
      );
  }
});

module.exports = EventCount;