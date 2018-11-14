import React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';
import mockdate from 'mockdate';

import moment from 'moment';
import 'moment-timezone';

import FootTrafficCard from './index';
import {
  DEFAULT_TIME_SEGMENT_GROUP,
  DEFAULT_TIME_SEGMENT,
} from '../../helpers/time-segments/index';

function timeout(delay) {
  return new Promise(r => setTimeout(r, delay));
}

describe('Explore space foot traffic hour chart', function() {
  afterEach(() => mockdate.reset());

  describe('data fetching', function() {
    it('should fetch data and display it', async function() {
      const space = {
        id: 'spc_123',
        name: 'foo',
        currentCount: 5,
        timeZone: `America/New_York`
      };

      // Mock the data fetching call, and the current date so that we can assert properly.
      global.fetch = sinon.stub().resolves({
        ok: true,
        status: 200,
        clone() { return this; },
        json: () => Promise.resolve({
          total: 3,
          results: [
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
        }),
      });

      // Render the component
      const component = mount(<FootTrafficCard
        space={space}
        date="2017-01-01T00:00:00-05:00"
        timeSegmentGroup={DEFAULT_TIME_SEGMENT_GROUP}
        timeSegment={DEFAULT_TIME_SEGMENT}
      />);

      // Wait for data to be fetched.
      await timeout(0);
      assert.equal(global.fetch.callCount, 1);
      const requestParameters = global.fetch.getCall(0).args;

      // Make sure the request was correctly formulated for the `America/New_York` time zone.
      // On January 1st, the offset is NYC is 5 hours.
      assert.equal(requestParameters[1].qs.start_time, '2017-01-01T00:00:00.000-05:00');
      assert.equal(requestParameters[1].qs.end_time, '2017-01-01T23:59:59.999-05:00');
    });
    it('should fetch data and display it during a different part of the year', async function() {
      const space = {
        id: 'spc_123',
        name: 'foo',
        currentCount: 5,
        timeZone: `America/New_York`
      };

      // Mock the data fetching call, and the current date so that we can assert properly.
      global.fetch = sinon.stub().resolves({
        ok: true,
        status: 200,
        clone() { return this; },
        json: () => Promise.resolve({
          total: 3,
          results: [
            {
              count: 0,
              interval: {
                start: "2017-09-14T03:55:00.000Z",
                end: "2017-09-14T03:59:59.999Z",
                analytics: {min: 0, max: 0},
              },
              timestamp: "2017-09-14T03:55:00.000Z",
            },
            {
              count: 1,
              interval: {
                start: "2017-09-14T04:00:00.000Z",
                end: "2017-09-14T04:05:00.000Z",
                analytics: {min: 0, max: 1},
              },
              timestamp: "2017-09-14T04:00:00.000Z",
            },
            {
              count: 2,
              interval: {
                start: "2017-09-14T04:05:00.000Z",
                end: "2017-09-14T04:10:00.000Z",
                analytics: {min: 0, max: 2},
              },
              timestamp: "2017-09-14T04:00:00.000Z",
            },
          ],
        }),
      });
      mockdate.set(moment('2017-09-14T00:00:00-05:00'));

      // Render the component
      const component = mount(<FootTrafficCard
        space={space}
        timeSegmentGroup={DEFAULT_TIME_SEGMENT_GROUP}
        timeSegment={DEFAULT_TIME_SEGMENT}
      />);

      // Wait for data to be fetched.
      await timeout(250);
      assert.equal(global.fetch.callCount, 1);
      const requestParameters = global.fetch.getCall(0).args;

      // Make sure the request was correctly formulated for the `America/New_York` time zone.
      // On January 1st, the offset is NYC is 4 hours.
      assert.equal(requestParameters[1].qs.start_time, '2017-09-14T00:00:00.000-04:00');
      assert.equal(requestParameters[1].qs.end_time, '2017-09-14T23:59:59.999-04:00');
    });
    it('should fetch data and display it in a different time zone', async function() {
      const space = {
        id: 'spc_123',
        name: 'foo',
        currentCount: 5,
        timeZone: `America/Los_Angeles`
      };

      // Mock the data fetching call, and the current date so that we can assert properly.
      global.fetch = sinon.stub().resolves({
        ok: true,
        status: 200,
        clone() { return this; },
        json: () => Promise.resolve({
          total: 3,
          results: [
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
        }),
      });
      mockdate.set(moment('2017-01-01T00:00:00-05:00'));

      // Render the component
      const component = mount(<FootTrafficCard
        space={space}
        timeSegmentGroup={DEFAULT_TIME_SEGMENT_GROUP}
        timeSegment={DEFAULT_TIME_SEGMENT}
      />);

      // Wait for data to be fetched.
      await timeout(250);
      assert.equal(global.fetch.callCount, 1);
      const requestParameters = global.fetch.getCall(0).args;

      // Make sure the request was correctly formulated for the `America/New_York` time zone.
      // On January 1st, the offset is NYC is 5 hours.
      assert.equal(requestParameters[1].qs.start_time, '2016-12-31T00:00:00.000-08:00');
      assert.equal(requestParameters[1].qs.end_time, '2016-12-31T23:59:59.999-08:00');
    });
    it('should fetch data and display it, only including data in the time segment', async function() {
      const space = {
        id: 'spc_123',
        name: 'foo',
        currentCount: 5,
        timeZone: `America/New_York`
      };

      // Mock the data fetching call, and the current date so that we can assert properly.
      global.fetch = sinon.stub().resolves({
        ok: true,
        status: 200,
        clone() { return this; },
        json: () => Promise.resolve({
          total: 3,
          results: [
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
        }),
      });

      // Create a custom time segment to inject into the component with a different id
      const customTimeSegmentGroup = { ...DEFAULT_TIME_SEGMENT, id: 'tsg_custom' };

      // Render the component
      const component = mount(<FootTrafficCard
        space={space}
        date="2017-01-01T00:00:00-05:00"
        timeSegmentGroup={customTimeSegmentGroup}
        timeSegment={DEFAULT_TIME_SEGMENT}
      />);

      // Wait for data to be fetched.
      await timeout(0);
      assert.equal(global.fetch.callCount, 1);
      const requestParameters = global.fetch.getCall(0).args;

      // Make sure the request was correctly formulated for the `America/New_York` time zone.
      // On January 1st, the offset is NYC is 5 hours. ALso, ensure that the correct time segment
      // group was passed.
      assert.equal(requestParameters[1].qs.start_time, '2017-01-01T00:00:00.000-05:00');
      assert.equal(requestParameters[1].qs.end_time, '2017-01-01T23:59:59.999-05:00');
      assert.equal(requestParameters[1].qs.time_segment_groups, customTimeSegmentGroup.id);
    });
  });

  describe('rendering', function() {
    // Mock the data fetching call, and the current date so that we can assert properly.
    beforeEach(() => {
      global.fetch = sinon.stub().resolves({
        ok: true,
        status: 200,
        clone() { return this; },
        json: () => Promise.resolve({
          total: 3,
          results: [
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
        }),
      });
      mockdate.set(moment('2017-01-01T00:00:00-05:00'));
    });

    it('should fetch data and display it', async function() {
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
      />);

      // Wait for data to be fetched.
      await timeout(250);

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

      // Render the component
      const component = mount(<FootTrafficCard
        space={space}
        timeSegmentGroup={DEFAULT_TIME_SEGMENT_GROUP}
        timeSegment={DEFAULT_TIME_SEGMENT}
      />);

      // Don't wait for loading to happen!

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
        /* no capacity */
      };

      // Render the component
      const component = mount(<FootTrafficCard
        space={space}
        timeSegmentGroup={DEFAULT_TIME_SEGMENT_GROUP}
        timeSegment={DEFAULT_TIME_SEGMENT}
      />);

      // Don't wait for loading to happen!

      // Capacity should not be set.
      const renderedCapacity = component.find('.explore-space-detail-foot-traffic-card-well-section.capacity .explore-space-detail-foot-traffic-card-well-section-quantity').text();
      assert.equal(renderedCapacity, '-');
    });
  });
});
