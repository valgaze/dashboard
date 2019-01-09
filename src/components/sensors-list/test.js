import * as React from 'react';
import { mount, shallow } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';

import { SensorsList } from './index';


describe('sensors list', function() {
  it('should render sensors list (smoke test)', async function() {
    // Render the component
    const component = shallow(<SensorsList 
      sensors={{
        data: [{
          serialNumber: 'Z123',
          status: 'online',
          lastHeartbeat: '2016-05-23T10:00:00.000Z',
          doorwayId: 'drw_123',
          doorwayName: 'the great doorway'
        }],
      }}
      spaces={{
        filters: {search: ''},
        data: [{
          id: 'spc_1',
          name: 'My Space',
          spaceType: 'space',
          currentCount: 2,
          capacity: 5,
          timeZone: 'America/New_York',
          doorways: []
        }],
      }}
    />);

    // Ensure that a single sensor is rendered
    assert.equal(component.find('.sensors-list-table').length, 2);
  });
});
