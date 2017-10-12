import * as React from 'react';

import timings from '@density/ui/variables/timings';

import Card, { CardHeader, CardBody } from '@density/ui-card';

import autoRefreshHoc from '../../helpers/auto-refresh-hoc/index';
import formatCapacityPercentage from '../../helpers/format-capacity-percentage/index';

import { chartAsReactComponent } from '@density/charts';
import RealTimeCountFn from '@density/chart-real-time-count';
import LinearProgressFn from '@density/chart-linear-progress';
const LinearProgress = chartAsReactComponent(LinearProgressFn);
const RealTimeCountChart = autoRefreshHoc({
  interval: 50,
  shouldComponentUpdate: function (nextProps) {
    return this.props.events.length || nextProps.events.length;
  }
})(chartAsReactComponent(RealTimeCountFn));

function CountLabel({count}) {
  if (typeof count !== 'number') {
    return null;
  } else if (count === 1) {
    return <span>1 person</span>;
  } else {
    return <span>{count} people</span>;
  }
}

export default function SpaceCard({space, events, onClick}) {
  if (space) {
    const capacityPercent = space.capacity ? (space.currentCount / space.capacity) * 100 : null;
    return <Card className="space-card">
      <div className="space-card-click-region" onClick={onClick}>
        <CardHeader className="space-card-header">
          <span className="space-card-header-name">{space.name}</span>
          <span className="space-card-header-count">
            {/* The below prints `1 person` or `n people` */}
            <CountLabel count={space.currentCount} />
          </span>
        </CardHeader>
        <CardBody>
          <div className="space-card-capacity-container">
            <div className="space-card-capacity-information">
              <div className="space-card-capacity-number">
                {/* The below prints `1 person` or `n people`. If `space.capacity` is null, leaves the element empty.*/}
                <CountLabel count={space.capacity} />
              </div>
              <div className="space-card-capacity-percent">
                {space.capacity ? formatCapacityPercentage(space.currentCount, space.capacity) : null}
              </div>
            </div>
            <div className="space-card-capacity-linear-progress">
              <LinearProgress percentFull={capacityPercent || 0} transitionDuration={timings.timingBase} />
            </div>
          </div>
        </CardBody>
      </div>

      <div className="space-card-chart">
        <RealTimeCountChart events={events || []} />
      </div>
    </Card>;
  } else {
    return null;
  }
}
