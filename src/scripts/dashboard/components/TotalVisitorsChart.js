import React from 'react';
import {connect} from 'react-redux';
import c3 from 'c3';


let TotalVisitorsChart = React.createClass({
  drawChart: function() {
    var chart = c3.generate({
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
              ['Date', '2016-01-01', '2016-01-02', '2016-01-03', '2016-01-04', '2016-01-05', '2016-01-06'],
              ['Total Visitors', 10, 20, 15, 18, 14, 4]
          ],
          type: 'bar',
          labels: true
      },
      transition: {
          duration: 700
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
                  format: '%A %m/%d',
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
    return chart;
  },
  
  componentDidMount: function() {
    this.drawChart();
  },

  componentDidUpdate: function () {
    this.drawChart();
  },

  render: function() {
    return (
      <div>
        <div id="totalvisitorschart"></div>
      </div>);
  }
});

module.exports = TotalVisitorsChart;