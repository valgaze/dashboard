import React from 'react';
import {connect} from 'react-redux';
import c3 from 'c3';

import moment from 'moment';
import {} from "moment-range";

let TotalVisitorsChart = React.createClass({

  drawChart: function(dates, totalVisitorCounts) {
    let newDates = ['Date'].concat(dates);
    let newVisitorCounts = ['Total Visitors'].concat(totalVisitorCounts);
    this._chart = c3.generate({
      bindto: '#totalvisitorschart',
      tooltip: {
          show: false
      },
      data: {
          x: 'Date',
          y: 'Total Visitors',
          colors: {
              'Total Visitors': '#469AFD',
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
                  format: '%m/%d',
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
    let newVisitorCounts = ['Total Visitors'].concat(totalVisitorCounts);
    this._chart.load({
      columns: [
        newDates,
        newVisitorCounts
      ]
    });
  },
  
  componentDidMount: function() {
    var dayRange = moment.range(this.props.startDate, this.props.endDate).toArray('days').map(date => date.format('YYYY-MM-DD'));
    this.drawChart(dayRange, [10, 20, 15, 18, 14, 4]);
  },

  componentDidUpdate: function () {
    var dayRange = moment.range(this.props.startDate, this.props.endDate).toArray('days').map(date => date.format('YYYY-MM-DD'));
    this.updateChart(dayRange, [15, 0, 1, 18, 14, 4]);
  },

  render: function() {
    return (
      <div>
        <div id="totalvisitorschart"></div>
      </div>
    );
  }
});

module.exports = TotalVisitorsChart;