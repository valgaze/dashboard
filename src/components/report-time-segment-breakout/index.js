import React, { Component } from 'react';
import propTypes from 'prop-types';
import styles from './_styles.scss';

import moment from 'moment';
import * as d3Scale from 'd3-scale'; /* note: this package doesn't have a `default` export */
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Color from 'd3-color';
import commaNumber from 'comma-number';

import ReportWrapper, { ReportPadding, ReportCard, ReportSubHeader } from '@density/ui-report-wrapper';

// From 'hex-rgb' npm package
// The package isn't pre-compiled by default, which means that create react app v1 doesn't know how
// ot use it.
const hexChars = 'a-f\\d';
const match3or4Hex = `#?[${hexChars}]{3}[${hexChars}]?`;
const match6or8Hex = `#?[${hexChars}]{6}([${hexChars}]{2})?`;
const nonHexChars = new RegExp(`[^#${hexChars}]`, 'gi');
const validHexSize = new RegExp(`^${match3or4Hex}$|^${match6or8Hex}$`, 'i');

const colorVariables = {
  "grayCinder": "#222A2E",

  "grayDarkest": "#4E5457",
  "grayDarker": "#8E9299",
  "grayDark": "#B4B8BF",
  "gray": "#CBCFD6",
  "grayLight": "#E8E8ED",
  "grayLighter": "#F0F0F2",
  "grayLightest": "#FAFAFA",

  "brandPrimary": "#4198FF",
  "brandPrimaryLight": "#97A6D4",
  "brandSuccess": "#80CD80",
  "brandDanger": "#FF5454",
  "brandWarning": "#FFBA08",

  "textColor": "#8E9299",
  "headerColor": "#4E5457",
  "inputFieldTextColor": "#CBCFD6",
  "inputFieldTextActiveColor": "#4E5457",

  "brandPrimaryNew": "#3663E5",
  "reportBlueLight": "#97A6D4",
  "reportGreen": "#4E8475",
  "reportYellow": "#F9B35B",
  "reportOrange": "#F26B40",
  "reportRed": "#FF7B6C"
};

// ----------------------------------------------------------------------------
// START BEZIER CURVE CODE
// ----------------------------------------------------------------------------
//
// From https://medium.com/@francoisromain/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
const line = (pointA, pointB) => {
  const lengthX = pointB[0] - pointA[0]
  const lengthY = pointB[1] - pointA[1]
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  }
}
// Position of a control point
// I:  - current (array) [x, y]: current point coordinates
//     - previous (array) [x, y]: previous point coordinates
//     - next (array) [x, y]: next point coordinates
//     - reverse (boolean, optional): sets the direction
// O:  - (array) [x,y]: a tuple of coordinates
const controlPoint = (current, previous, next, reverse) => {
  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
  const p = previous || current
  const n = next || current
  // The smoothing ratio
  const smoothing = 0.2
  // Properties of the opposed-line
  const o = line(p, n)
  // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0)
  const length = o.length * smoothing
  // The control point position is relative to the current point
  const x = current[0] + Math.cos(angle) * length
  const y = current[1] + Math.sin(angle) * length
  return [x, y]
}

// Create the bezier curve command
// I:  - point (array) [x,y]: current point coordinates
//     - i (integer): index of 'point' in the array 'a'
//     - a (array): complete array of points coordinates
// O:  - (string) 'C x2,y2 x1,y1 x,y': SVG cubic bezier C command
const bezierCommand = (point, i, a) => {
  // start control point
  const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point)
  // end control point
  const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true)
  return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`
}

const lineCommand = point => `L${point[0]},${point[1]}`

// ----------------------------------------------------------------------------
// END BEZIER CURVE CODE
// ----------------------------------------------------------------------------

class ReportTimeSegmentBreakdownChart extends Component {
  constructor(props) {
    super(props);
    this.state = { width: null, height: 300 };
    this.onResize = this.onResize.bind(this);

    this.chartTopSpacing = 20;
    this.xAxisMarkTopSpacing = 25;
    this.xAxisMarkFontSize = 16;
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    const width = this.container.clientWidth;
    this.setState({
      width,
      height: width / 2,
    });
  }

  convertTimeToSeconds(time) {
    return moment.duration(time).asSeconds();
  }

  // Generate an array of "marks" for below the graph, starting at the beginning of the time segment
  // and ending at the end of the time segment.
  generateXAxisMarks() {
    const { timeSegment } = this.props;
    const { width } = this.state;

    const start = moment.duration(timeSegment.start);
    const end = moment.duration(timeSegment.end);

    const startHour = start.asHours();
    const endHour = end.asHours();

    const numberOfHours = (endHour - startHour);
    const distanceBetweenHoursInPx = width / numberOfHours;

    let hoursBetweenTicks = 1;
    if (distanceBetweenHoursInPx < 30) {
      hoursBetweenTicks = 3;
    } else if (distanceBetweenHoursInPx < 50) {
      hoursBetweenTicks = 2;
    }

    const marks = [];
    for (let label = startHour; label <= endHour; label += hoursBetweenTicks) {
      marks.push({
        value: label * 3600, // convert label to seconds
        label: moment.utc().startOf('day').add(label, 'hours').format('ha').slice(0, -1),
      });
    }
    return marks;
  }

  render() {
    const {
      startTime,
      endTime,
      lines,
      timeSegment,
      maxCount,
    } = this.props;
    const { width, height } = this.state;

    const graphHeight = height - this.xAxisMarkFontSize - this.xAxisMarkTopSpacing - this.chartTopSpacing;

    const xScale = d3Scale.scaleLinear()
      .domain([
        this.convertTimeToSeconds(timeSegment.start),
        this.convertTimeToSeconds(timeSegment.end),
      ])
      .range([0+20, width-20]);

    const yScale = d3Scale.scaleLinear()
      .domain([0, maxCount])
      .range([graphHeight, this.chartTopSpacing])

    return (
      <div ref={r => { this.container = r; }} className={styles.chartContainer}>
        {/* When the width is unknown, the chart cannot be rendered. */}
        {width !== null ? (
          <svg width={width} height={height}>
            {/* Render bottom axis every hour */}
            {this.generateXAxisMarks().map(({value, label}, index, xAxisMarks) => (
              <text
                key={value}
                fill={colorVariables.grayDarker}
                transform={`translate(${xScale(value)}, ${height - this.xAxisMarkFontSize})`}
                fontSize={this.xAxisMarkFontSize}
                style={{userSelect: 'none'}}
                textAnchor={(function() {
                  if (index === 0) {
                    return 'start';
                  } else if (index === xAxisMarks.length-1) {
                    return 'end';
                  } else {
                    return 'middle';
                  }
                })()}
              >{label}</text>
            ))}

            {/* Render the chart of the day's average data */}
            {(() => {

              const curves = lines.map(points => {
                return points.map(({value, timestamp}) => [
                  xScale(this.convertTimeToSeconds(timestamp)), /* x */
                  yScale(value), /* y */
                ]).reduce((acc, point, index, all) => {
                  if (index === 0) {
                    return `M${point[0]},${point[1]}`;
                  } else {
                    // If you'd like to debug a rendering issue without the bezier curves (just with
                    // lines), uncomment the line below.
                    // const result = lineCommand(point, index, all);
                    const result = bezierCommand(point, index, all);
                    return `${acc} ${result}`;
                  }
                }, '');
              })

              return curves.map((curve, index) => {
                const redShift = index / (curves.length - 1);
                let color = d3Color.color(d3ScaleChromatic.interpolateRdBu(redShift));
                color = color.darker((0.5 - Math.abs(redShift - 0.5)) * 4)
                color = color.brighter((Math.abs(redShift - 0.5)) * 4).toString();
                return <g>
                  {/* The chart outline */}
                  <path
                    transform={`translate(0,${this.chartTopSpacing})`}
                    d={`M0,${yScale(0)}   ${curve}   M0,${yScale(0)}`}
                    fill="transparent"
                    strokeWidth={2}
                    stroke={color}
                    opacity={.5}
                  />
                </g>
              });
            })()}
          </svg>
        ) : null}
      </div>
    );
  }
}

function formatTime(time) {
  return moment.utc(moment.duration(time).asMilliseconds())
    .format('h:mma')
    .slice(0, -1); /* am -> a */
}

function peoplePluralizer(n) {
  if (n === 1) {
    return 'person';
  } else {
    return 'people';
  }
}

export default function ReportTimeSegmentBreakout({
  title,
  startDate,
  endDate,
  spaces,
  color,

  timeSegment,
  timeSegmentGroup,
  lines,
  averageEntrances,
}) {
  const maxCount = Math.max.apply(Math, lines.map(i => Math.max.apply(Math, i.map(j => j.value))));
  return (
    <ReportWrapper
      title={title}
      startDate={startDate}
      endDate={endDate}
      spaces={spaces}
    >
      <ReportSubHeader
        title={
          <span>
            <strong>{timeSegmentGroup.name}</strong> had a daily average of {' '}
            <strong>{commaNumber(averageEntrances)}</strong> visitors and a peak {' '}
            occupancy of <strong>{commaNumber(maxCount)}</strong>.
          </span>
        }
        >
      </ReportSubHeader>

      <ReportCard noPadding>
        <ReportTimeSegmentBreakdownChart
          timeSegment={timeSegment}
          lines={lines}
          maxCount={maxCount}
          color={color}
        />
      </ReportCard>
    </ReportWrapper>
  );
}

// ReportTimeSegmentBreakout.propTypes = {
//   title: propTypes.string.isRequired,
//   startDate: propTypes.instanceOf(moment).isRequired,
//   endDate: propTypes.instanceOf(moment).isRequired,
//   spaces: propTypes.arrayOf(propTypes.string).isRequired,
//   color: propTypes.string.isRequired,

//   timeSegment: propTypes.shape({
//     id: propTypes.string.isRequired,
//     name: propTypes.string.isRequired,
//     start: propTypes.string.isRequired,
//     end: propTypes.string.isRequired,
//     days: propTypes.arrayOf(propTypes.string).isRequired,
//     spaces: propTypes.arrayOf(propTypes.any).isRequired,
//   }).isRequired,
//   timeSegmentGroup: propTypes.shape({
//     id: propTypes.string.isRequired,
//     name: propTypes.string.isRequired,
//   }).isRequired,

//   lines: propTypes.arrayOf(
//     propTypes.arrayof(
//       propTypes.shape({
//         timestamp: propTypes.string,
//         value: propTypes.number,
//       })
//     )
//   ).isRequired,

//   dailyAverage: propTypes.number,

//   peakRateOfEntryTimestamp: propTypes.string.isRequired,
//   peakRateOfEntryQuantity: propTypes.number.isRequired,

//   peakOccupancyTimestamp: propTypes.string.isRequired,
//   peakOccupancyQuantity: propTypes.number.isRequired,
// };
// ReportTimeSegmentBreakout.defaultProps = {
//   color: colorVariables.reportOrange,
// };
