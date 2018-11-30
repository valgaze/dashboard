import React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';
import mockdate from 'mockdate';

import moment from 'moment';
import 'moment-timezone';

import { ExploreSpaceDetailFootTrafficCard as FootTrafficCard } from './index';
import {
  DEFAULT_TIME_SEGMENT_GROUP,
  DEFAULT_TIME_SEGMENT,
} from '../../helpers/time-segments/index';

function timeout(delay) {
  return new Promise(r => setTimeout(r, delay));
}

describe('Explore space foot traffic hour chart', function() {
  afterEach(() => mockdate.reset());

  it('should display data properly', async function() {
    const space = {
      id: 'spc_123',
      name: 'foo',
      currentCount: 5,
      timeZone: `America/New_York`,
      capacity: 10,
    };

    // Render the component
    const component = mount(<FootTrafficCard
      space={space}
      date="2017-01-01T00:00:00-05:00"
      timeSegmentGroup={DEFAULT_TIME_SEGMENT_GROUP}
      timeSegment={DEFAULT_TIME_SEGMENT}
      calculatedData={{
        state: 'COMPLETE',
        data: [
          {
            count: 0,
            interval: {
              start: "2017-01-01T03:55:00.000Z",
              end: "2017-01-01T03:59:59.999Z",
              analytics: {min: 0, max: 0},
            },
            timestamp: "2017-01-01T03:55:00.000Z",
          },
          {
            count: 1,
            interval: {
              start: "2017-01-01T04:00:00.000Z",
              end: "2017-01-01T04:05:00.000Z",
              analytics: {min: 0, max: 1},
            },
            timestamp: "2017-01-01T04:00:00.000Z",
          },
          {
            count: 2,
            interval: {
              start: "2017-01-01T04:05:00.000Z",
              end: "2017-01-01T04:10:00.000Z",
              analytics: {min: 0, max: 2},
            },
            timestamp: "2017-01-01T04:00:00.000Z",
          },
        ],
      }}
    />);

    // Correctly render the minimum, maximum, and capacity in the well above the chart
    const renderedCapacity = component.find('.explore-space-detail-foot-traffic-card-well-section.capacity .explore-space-detail-foot-traffic-card-well-section-quantity').text(),
          renderedMinimum = component.find('.explore-space-detail-foot-traffic-card-well-section.minimum .explore-space-detail-foot-traffic-card-well-section-quantity').text(),
          renderedMaximum = component.find('.explore-space-detail-foot-traffic-card-well-section.maximum .explore-space-detail-foot-traffic-card-well-section-quantity').text();
    assert.equal(renderedCapacity, 10);
    assert.equal(renderedMinimum, 0);
    assert.equal(renderedMaximum, 2);
  });
  it('should show dashes in all the well sections when loading is currently happening', async function() {
    const space = {
      id: 'spc_123',
      name: 'foo',
      currentCount: 5,
      timeZone: `America/New_York`,
      capacity: 10,
    };

    // Render the component, in a loading state
    const component = mount(<FootTrafficCard
      space={space}
      date="2017-01-01T00:00:00-05:00"
      timeSegmentGroup={DEFAULT_TIME_SEGMENT_GROUP}
      timeSegment={DEFAULT_TIME_SEGMENT}
      calculatedData={{
        state: 'LOADING',
        data: null,
      }}
    />);

    // Render dashes for the minimum, and maximum in the well above the chart. Capacity is already
    // in the space model so that is already known.
    const renderedCapacity = component.find('.explore-space-detail-foot-traffic-card-well-section.capacity .explore-space-detail-foot-traffic-card-well-section-quantity').text(),
          renderedMinimum = component.find('.explore-space-detail-foot-traffic-card-well-section.minimum .explore-space-detail-foot-traffic-card-well-section-quantity').text(),
          renderedMaximum = component.find('.explore-space-detail-foot-traffic-card-well-section.maximum .explore-space-detail-foot-traffic-card-well-section-quantity').text();
    assert.equal(renderedCapacity, 10);
    assert.equal(renderedMinimum, '-');
    assert.equal(renderedMaximum, '-');
  });
  it('should show dashes in capacity well section when capacity is missing', async function() {
    const space = {
      id: 'spc_123',
      name: 'foo',
      currentCount: 5,
      timeZone: `America/New_York`,
      capacity: null, /* no capacity */
    };

    // Render the component
    const component = mount(<FootTrafficCard
      space={space}
      date="2017-01-01T00:00:00-05:00"
      timeSegmentGroup={DEFAULT_TIME_SEGMENT_GROUP}
      timeSegment={DEFAULT_TIME_SEGMENT}
      calculatedData={{
        state: 'COMPLETE',
        data: [
          {
            count: 0,
            interval: {
              start: "2017-01-01T03:55:00.000Z",
              end: "2017-01-01T03:59:59.999Z",
              analytics: {min: 0, max: 0},
            },
            timestamp: "2017-01-01T03:55:00.000Z",
          },
          {
            count: 1,
            interval: {
              start: "2017-01-01T04:00:00.000Z",
              end: "2017-01-01T04:05:00.000Z",
              analytics: {min: 0, max: 1},
            },
            timestamp: "2017-01-01T04:00:00.000Z",
          },
          {
            count: 2,
            interval: {
              start: "2017-01-01T04:05:00.000Z",
              end: "2017-01-01T04:10:00.000Z",
              analytics: {min: 0, max: 2},
            },
            timestamp: "2017-01-01T04:00:00.000Z",
          },
        ],
      }}
    />);

    // Don't wait for loading to happen!

    // Capacity should not be set.
    const renderedCapacity = component.find('.explore-space-detail-foot-traffic-card-well-section.capacity .explore-space-detail-foot-traffic-card-well-section-quantity').text();
    assert.equal(renderedCapacity, '-');
  });
});
