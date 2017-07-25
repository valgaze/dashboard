import * as React from 'react';

import Card, { CardHeader, CardBody } from '@density/ui-card';
import autoRefreshHoc from '../../helpers/auto-refresh-hoc/index';

import { chartAsReactComponent } from '@density/charts';
import IngressEgressFn from '@density/chart-ingress-egress';
const IngressEgressChart = autoRefreshHoc({interval: 1000})(chartAsReactComponent(IngressEgressFn));

export default function SpaceCard({space, events}) {
  if (space) {
    return <Card>
      <CardHeader>{space.name}</CardHeader>
      <CardBody>
        <ul>
          <li>Timezone: {space.timezone}</li>
          <li>Count: {space.currentCount}</li>
          <li>Capacity: {space.capacity || 'N/A'}</li>
        </ul>
      </CardBody>

      <div className="space-card-chart">
        <IngressEgressChart events={events || []} graphDurationInMin={1} />
      </div>
    </Card>;
  } else {
    return null;
  }
}
