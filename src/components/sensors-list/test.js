import * as React from 'react';
import { mount, shallow } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';

import { LiveSpaceList } from './index';

function timeout(delay) {
  return new Promise(r => setTimeout(r, delay));
}

describe('live space list', function() {
  it('should render list space list (smoke test)', async function() {
    // Render the component
    const component = shallow(<LiveSpaceList 
      spaces={{
        filters: {search: ''},
        data: [{
          id: 'spc_1',
          name: 'My Space',
          spaceType: 'space',
          currentCount: 2,
          capacity: 5,
          timeZone: 'America/New_York',
        }],
        events: {}
      }}
      eventPusherStatus={{status: 'CLOSED'}}
      activeModal={{name: null, data: null}}
    />);

    // Ensure that no spaces were rendered
    assert.equal(component.find('.live-space-list-item').length, 1);
  });

  it('should render list space list when online', async function() {
    // Render the component
    const component = mount(<LiveSpaceList 
      spaces={{
        filters: {search: ''},
        data: [],
        events: {}
      }}
      eventPusherStatus={{status: 'CONNECTED'}}
      activeModal={{name: null, data: null}}
    />);

    // Ensure that that the "tag" next to the page title reads "LIVE"
    assert.notEqual(
      component.find('.live-space-list-live-indicator-tag').debug().indexOf('LIVE'),
      -1
    );

    // And that the colored bubble within the tag is gray.
    assert.equal(component.find('.live-space-list-live-indicator-tag').childAt(0).prop('className'), 'status-connected');
  });
});
