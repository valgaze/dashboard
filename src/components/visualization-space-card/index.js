import * as React from 'react';

import timings from '@density/ui/variables/timings';

import Card, { CardHeader, CardBody } from '@density/ui-card';
import autoRefreshHoc from '../../helpers/auto-refresh-hoc/index';

import { chartAsReactComponent } from '@density/charts';
import IngressEgressFn from '@density/chart-ingress-egress';
import LinearProgressFn from '@density/chart-linear-progress';
const IngressEgressChart = autoRefreshHoc({interval: 1000})(chartAsReactComponent(IngressEgressFn));
const LinearProgress = chartAsReactComponent(LinearProgressFn);

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
      <CardHeader className="space-card-header" onClick={onClick}>
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
            <div className="space-card-capacity-percent">{capacityPercent}</div>
          </div>
          <div className="space-card-capacity-linear-progress">
            <LinearProgress percentFull={capacityPercent || 0} transitionDuration={timings.timingBase} />
          </div>
        </div>
      </CardBody>

      <div className="space-card-chart">
        <IngressEgressChart events={events || []} graphDurationInMin={1} />
      </div>
    </Card>;
  } else {
    return null;
  }
}
