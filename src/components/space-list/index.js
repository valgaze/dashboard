import * as React from 'react';
import { connect } from 'react-redux';
import Card, { CardHeader, CardBody } from '@density/ui-card';
import autoRefreshHoc from '../../helpers/auto-refresh-hoc/index';

import { chartAsReactComponent } from '@density/charts';
import IngressEgressFn from '@density/chart-ingress-egress';
const IngressEgressChart = autoRefreshHoc({interval: 1000})(chartAsReactComponent(IngressEgressFn));

function SpaceCard({space, events}) {
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

      <IngressEgressChart events={events || []} graphDurationInMin={1} />
    </Card>;
  } else {
    return null;
  }
}

export function SpaceList({spaces}) {
  return <div className="space-list">
    <div className="space-list-row">
      {spaces.data.map(space => {
        return <div className="space-list-item" key={space.id}>
          <a href={`#/spaces/${space.id}`}>Go to details for {space.id}</a>
          <SpaceCard space={space} events={spaces.events[space.id]} />
        </div>;
      })}
    </div>
  </div>;
}

export default connect(state => {
  return {
    spaces: state.spaces,
  };
}, dispatch => {
  return {};
})(SpaceList);
