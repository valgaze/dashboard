import React, { Component } from 'react';
import * as d3Scale from 'd3-scale';

import timings from '@density/ui/variables/timings';

import Card, { CardHeader, CardBody } from '@density/ui-card';

import autoRefreshHoc from '../../helpers/auto-refresh-hoc/index';
import formatCapacityPercentage from '../../helpers/format-capacity-percentage/index';

import moment from 'moment';

import { chartAsReactComponent } from '@density/charts';
import RealTimeCountFn from '@density/chart-real-time-count';
import LinearProgressFn from '@density/chart-linear-progress';
const LinearProgress = chartAsReactComponent(LinearProgressFn);
const RealTimeCountChart = chartAsReactComponent(RealTimeCountFn);

const EVENTS = [
  { countChange: 1, timestamp: moment.utc().add(10, 'seconds').format() },
  { countChange: -1, timestamp: moment.utc().add(1, 'seconds').format() },
];

function getNow() {
  return window.performance ? window.performance.now() : Date.now();
}

class Refresher extends Component {
  state = { time: 0 }

  componentDidMount() {
    this.nextAnimationFrameId = window.requestAnimationFrame(this.onFrame);
  }
  componentWillUnmount() {
    window.cancelAnimationFrame(this.nextAnimationFrameId);
  }

  onFrame = () => {
    this.setState({
      time: getNow(),
    });
    this.nextAnimationFrameId = window.requestAnimationFrame(this.onFrame);
  }

  render() {
    const nowMs = moment.utc().valueOf();
    return (
      this.props.content(nowMs)
    );
  }
}


export default function SpaceCard({
  space,
  events,
  nowMs,

  onClickRealtimeChartFullScreen,
  onClickEditCount,
}) {
  if (space) {
    const capacityPercent = space.capacity ? (space.currentCount / space.capacity) * 100 : null;
    return <Card className="space-card">
      <CardHeader className="space-card-header">
        <span className="space-card-header-name">{space.name}</span>
        <span className="space-card-header-count">{space.currentCount}</span>
      </CardHeader>
      <CardBody>
        <div className="space-card-capacity-container">
          <div className="space-card-capacity-information">
            <div className="space-card-utilization-percentage">
              {
                space.capacity ?
                <span className="space-card-utilization-percentage-label">
                  Utilization: 
                  <span> {formatCapacityPercentage(space.currentCount, space.capacity)}%</span>
                </span> :
                'Max capacity not yet specified'
              }
            </div>
            <div className="space-card-edit-count-link" onClick={onClickEditCount}>Edit count</div>
          </div>
          <div className="space-card-capacity-linear-progress">
            <LinearProgress
              percentFull={capacityPercent || 0}
              transitionDuration={timings.timingBase}
            />
          </div>
        </div>
      </CardBody>

      <div className="space-card-chart">
        <div
          className="space-card-chart-full-screen"
          onClick={onClickRealtimeChartFullScreen}
        >&#xe919;</div>
        {/* <RealTimeCountChart */}
        {/*   events={events || []} */}
        {/*   key={performance.now()} */}
        {/* /> */}
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
        <Refresher content={nowMs => (
          <SpaceCardChart nowMs={nowMs} events={events || []} />
        )} />
      </div>
    </Card>;
  } else {
    return null;
  }
}


class SpaceCardChart extends Component {
  constructor(props) {
    super(props);
    this.startTimeMs = moment.utc().valueOf();
  }
  render() {
    if (!this.container) {
      return (
        <div
          ref={r => { this.container = r; }}
          style={{width: '100%', height: '100%'}}
        />
      );
    }

    const width = 400;
    const height = 160;
    const { nowMs } = this.props;

    const slidingScale = d3Scale.scaleLinear()
      .domain([60 * 1000, 0])
      .range([0, width]);
    const chartScale = d3Scale.scaleLinear()
      .domain([0, 60 * 1000])
      .range([0, width]);

    const offsettedEvents = this.props.events.map(event => ({
      // offset: moment.utc(event.timestamp).valueOf() - this.startTimeMs,
      offset: moment.utc(event.timestamp).valueOf() - this.startTimeMs,
      countChange: event.countChange,
    }));

    return (
      <div
        ref={r => { this.container = r; }}
        style={{width: '100%', height: '100%'}}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        >
          <g transform={`translate(${slidingScale(nowMs - this.startTimeMs)}, 0)`}>
            {offsettedEvents.map(event => (
              <circle
                key={event.offset}
                cx={chartScale(event.offset)}
                cy={10}
                r="5"
                fill="red"
              />
            ))}
          </g>
        </svg>
      </div>
    );
  }
}



// ----------------------------------------------------------------------------
// CANVAS TEST
// ----------------------------------------------------------------------------

// class SpaceCardChart extends Component {
//   componentDidMount() {
//     this.epochAtRender = performance.now();
//
//     const context = this.canvas.getContext('2d');
//     context.fillStyle = 'red';
//     context.fillRect(468-100, 0, 100, 100);
//
//     this.nextAnimationFrameId = window.requestAnimationFrame(this.onFrame);
//   }
//   componentWillUnmount() {
//     window.cancelAnimationFrame(this.nextAnimationFrameId);
//   }
//
//   onFrame = timestamp => {
//     const msSinceInitialRender = this.epochAtRender - performance.now();
//     const pixelOffset = (msSinceInitialRender / 600000) * this.canvas.width;
//
//     const context = this.canvas.getContext('2d');
//     const imageData = context.getImageData(0, 0, this.canvas.width, this.canvas.height);
//     context.putImageData(imageData, pixelOffset, 0);
//
//     this.nextAnimationFrameId = window.requestAnimationFrame(this.onFrame);
//   }
//
//   render() {
//     return (
//       <canvas
//         width={468}
//         height={160}
//         ref={r => { this.canvas = r; }}
//       />
//     );
//   }
// }




// ----------------------------------------------------------------------------
// SVG MOVING INNER SVG VERSION
// ----------------------------------------------------------------------------

// const SPACE_CARD_CHART_HEIGHT = 160;
// export class SpaceCardChart extends Component {
//   // state = {
//   //   msSinceInitialRender: 0,
//   // }
//   // timeAtRender = 0
//
//   // componentDidMount() {
//   //   this.timeAtRender = moment.utc();
//   //   this.nextAnimationFrameId = window.requestAnimationFrame(this.onFrame);
//   // }
//   // componentWillUnmount() {
//   //   window.cancelAnimationFrame(this.nextAnimationFrameId);
//   // }
//
//   // onFrame = () => {
//   //   const now = moment.utc();
//   //   this.setState({
//   //     msSinceInitialRender: now.valueOf() - this.timeAtRender.valueOf(),
//   //   }, () => {
//   //     this.nextAnimationFrameId = window.requestAnimationFrame(this.onFrame);
//   //   });
//   // }
//
//   render() {
//     const { msSinceInitialRender } = this.state;
//     const percentageOffset = 0;//(msSinceInitialRender / 60000) * 100;
//     return (
//       <svg width="100%" height={160}>
//         {#<{(| two svgs? idea from https://stackoverflow.com/questions/17098397/how-to-translate-an-svg-group-by-a-percentage-of-the-viewport |)}>#}
//         <svg x={`${100 - percentageOffset}%`} y={0}>
//           <rect
//             x={0}
//             y={0}
//             width="100%"
//             height="100%"
//             fill="red"
//           />
//
//         {this.props.events.map(event => (
//           <circle
//             key={event.timestamp}
//             cx={`${((moment.utc(event.timestamp).valueOf() - this.timeAtRender.valueOf()) / 60000) * 100}%`}
//             cy={10}
//             r={5}
//             fill="green"
//           />
//         ))}
//         </svg>
//       </svg>
//     );
//   }
// }






// const CONVEYER_LENGTH_MS = 60 * 1000;
// // const CONVEYER_LENGTH_MS = 10 * 1000;
// const SPACE_CARD_CHART_HEIGHT = 160;
//
// const INITIAL_STATE = {
//   view: 'ACTIVE',
//   conveyers: ['one'],
//   conveyerCycleCount: 0,
//
//   conveyerOneEvents: [],
//   conveyerTwoEvents: [],
// };
//
// class SpaceCardChart extends Component {
//   state = INITIAL_STATE
//
//   constructor(props) {
//     super(props);
//
//     this.componentInstantiationTimestamp = moment.utc();
//
//     window.addEventListener('visibilitychange', this.onVisibilityChange);
//     window.addEventListener('msvisibilitychange', this.onVisibilityChange);
//     window.addEventListener('webkitvisibilitychange', this.onVisibilityChange);
//   }
//
//   onVisibilityChange = () => {
// 		let hidden;
// 		if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
// 			hidden = "hidden";
// 		} else if (typeof document.msHidden !== "undefined") {
// 			hidden = "msHidden";
// 		} else if (typeof document.webkitHidden !== "undefined") {
// 			hidden = "webkitHidden";
// 		}
//
// 		const isHidden = document[hidden];
//
//     if (isHidden) {
//       this.setState({
//         view: 'INACTIVE',
//         conveyers: [],
//         conveyerCycleCount: -1,
//       });
//     } else {
//       this.componentInstantiationTimestamp = moment.utc();
//       this.setState(INITIAL_STATE);
//     }
//   }
//
//   componentDidMount() {
//     this.swapConveyersInterval = setInterval(() => {
//       this.swapConveyers();
//     }, CONVEYER_LENGTH_MS);
//   }
//   componentWillUnmount() {
//     window.clearInverval(this.swapConveyersInterval);
//   }
//
//   swapConveyers = () => {
//     this.setState(state => {
//       if (state.conveyers.length === 0) {
//         // Move "conveyer two" to the end
//         return {
//           conveyers: ['one', 'two'],
//           conveyerCycleCount: state.conveyerCycleCount + 1,
//           // conveyerTwoEvents: [],
//         };
//       } else {
//         // Move "conveyer one" to the end
//         return {
//           conveyers: ['two', 'one'],
//           conveyerCycleCount: state.conveyerCycleCount + 1,
//           // conveyerOneEvents: [],
//         };
//       }
//     }, () => {
//       // After swapping conveyers, rebalance conveyers to ensure that the right events are on the
//       // right conveyers
//       console.log('REBUCKETIZE');
//       this.rebucketizeEvents(this.props.events);
//     });
//   }
//
//   componentWillReceiveProps({events}) {
//     this.rebucketizeEvents(events);
//   }
//
//   rebucketizeEvents = (events) => {
//     const { conveyers, conveyerCycleCount } = this.state;
//
//     // Get the timestamps at the start of the new conveyer and the old conveyer
//     const timestampAtStartOfNewerConveyer = (
//       this.componentInstantiationTimestamp.clone()
//         .add(conveyerCycleCount * CONVEYER_LENGTH_MS, 'milliseconds')
//     );
//
//     const oldContainerRenderableEvents = events.filter(event => {
//       return moment.utc(event.timestamp).isBefore(timestampAtStartOfNewerConveyer);
//     });
//
//     const newContainerRenderableEvents = events.filter(event => {
//       return moment.utc(event.timestamp).isSameOrAfter(timestampAtStartOfNewerConveyer);
//     });
//
//     console.log(oldContainerRenderableEvents, timestampAtStartOfNewerConveyer.format(), newContainerRenderableEvents)
//     if (conveyers[0] === 'one') {
//       // one is the "newest" conveyer
//       this.setState({
//         conveyerOneEvents: newContainerRenderableEvents,
//         conveyerTwoEvents: oldContainerRenderableEvents,
//       });
//     } else {
//       this.setState({
//         conveyerTwoEvents: newContainerRenderableEvents,
//         conveyerOneEvents: oldContainerRenderableEvents,
//       });
//     }
//   }
//
//   render() {
//     const { conveyerCycleCount, conveyers } = this.state;
//
//     return (
//       <svg width="100%" height={SPACE_CARD_CHART_HEIGHT}>
//         <g>
//           {conveyers.map(conveyer => {
//             return (
//               <g className="space-card-chart-conveyer-belt" key={conveyer}>
//                 <rect
//                   x1="0"
//                   y1="0"
//                   width="100%"
//                   height={SPACE_CARD_CHART_HEIGHT}
//                   fill={conveyer === 'one' ? 'red' : 'blue'}
//                 />
//                 <text fill="white" transform="translate(20, 20)">{conveyer}</text>
//               </g>
//             );
//           })}
//         </g>
//         {conveyerCycleCount === 0 ? (
//           <g className="space-card-chart-conveyer-belt-header" key="header">
//             <rect
//               x1="0"
//               y1="0"
//               width="100%"
//               height={SPACE_CARD_CHART_HEIGHT}
//               fill="yellow"
//             />
//             <text fill="black" transform="translate(20, 20)">header</text>
//           </g>
//         ) : null}
//       </svg>
//     );
//   }
// }
