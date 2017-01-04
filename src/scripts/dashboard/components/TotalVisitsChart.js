import React from 'react';
import {connect} from 'react-redux';
import c3 from 'c3';

let TotalVisitsChart = React.createClass({

  drawChart: function(dates, totalVisitorCounts) {
    let newDates = ['Date'].concat(dates);
    let newVisitorCounts = ['Total Visits'].concat(totalVisitorCounts);
    this._chart = c3.generate({
      bindto: '#totalvisitschart',
      tooltip: {
        show: false
      },
      data: {
        x: 'Date',
        y: 'Total Visits',
        colors: {
          'Total Visits': '#469AFD',
        },
        columns: [
        newDates,
        newVisitorCounts,
        ],
        type: 'bar',
        labels: true
      },
      legend: {
        hide: true
      },
      axis: {
        y: {
          show: false
        },
        x: {
          type: 'timeseries',
          label: {
            show: false
          },
          height: 50,
          tick: {
            format: '%-m/%-d',
            outer: false
          }
        }
      },
      bar: {
        width: {
          ratio: 0.9
        }
      }
    });
  },

  updateChart: function(dates, totalVisitorCounts) {
    let newDates = ['Date'].concat(dates);
    let newVisitorCounts = ['Total Visits'].concat(totalVisitorCounts);
    this._chart.load({
      columns: [
      newDates,
      newVisitorCounts
      ]
    });
  },
  
  componentDidMount: function() {
    this.drawChart(this.props.dates, this.props.totalVisitorCounts);
  },

  componentDidUpdate: function () {
    this.updateChart(this.props.dates, this.props.totalVisitorCounts);
  },

  render: function() {
    return (
      <div>
      <div id="totalvisitschart"></div>
      </div>
      );
  }
});

module.exports = TotalVisitsChart;