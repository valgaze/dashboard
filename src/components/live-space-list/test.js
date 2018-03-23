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
        data: [{id: 'spc_1', name: 'My Space', currentCount: 2, capacity: 5, timeZone: 'America/New_York'}],
        events: {}
      }}
      eventPusherStatus={{status: 'CLOSED'}}
    />);

    // Ensure that no spaces were rendered
    assert.equal(component.find('.live-space-list-item').length, 1);
  });
  it('should render list space list when offline', async function() {
    // Render the component
    const component = mount(<LiveSpaceList 
      spaces={{
        filters: {search: ''},
        data: [],
        events: {}
      }}
      eventPusherStatus={{status: 'CLOSED'}}
    />);

    // Ensure that no spaces were rendered
    assert.equal(component.find('.live-space-list-item').length, 0);

    // Also ensure that that the "tag" next to the page title reads "OFFLINE"
    assert.notEqual(
      component.find('.live-space-list-live-indicator-tag').debug().indexOf('OFFLINE'),
      -1
    );

    // And that the colored bubble within the tag is gray.
    assert.equal(component.find('.live-space-list-live-indicator-tag').childAt(0).prop('className'), 'status-closed');
  });
  it('should render list space list when connecting', async function() {
    // Render the component
    const component = mount(<LiveSpaceList 
      spaces={{
        filters: {search: ''},
        data: [],
        events: {}
      }}
      eventPusherStatus={{status: 'CONNECTING'}}
    />);

    // Ensure that no spaces were rendered
    assert.equal(component.find('.live-space-list-item').length, 0);

    // Also ensure that that the "tag" next to the page title reads "OFFLINE"
    assert.notEqual(
      component.find('.live-space-list-live-indicator-tag').debug().indexOf('CONNECTING'),
      -1
    );

    // And that the colored bubble within the tag is gray.
    assert.equal(component.find('.live-space-list-live-indicator-tag').childAt(0).prop('className'), 'status-connecting');
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
