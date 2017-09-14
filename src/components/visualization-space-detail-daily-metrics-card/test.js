import * as React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';
import mockdate from 'mockdate';

import moment from 'moment';
import 'moment-timezone';

import VisualizationSpaceDetailDailyMetricsCard, { isOutsideRange } from './index';

function timeout(delay) {
  return new Promise(r => setTimeout(r, delay));
}

describe('Visualization space 24 hour chart', function() {
  afterEach(() => mockdate.reset());

  // Used to figure out which days are visible and which days are hidden within the date range
  // picker.
  describe('isOutsideRange', function() {
    // Mock the current date for the tests.
    beforeEach(() => mockdate.set('1/1/2017'));

    it('should block out two weeks way before the current date', function() {
      // Start a date selection. 
      let datePickerSelection = 'startDate';

      // The user clicks a start date many months ago (ie, not around now)
      const rangeStart = moment.utc().subtract(3, 'months');
      datePickerSelection = 'endDate';


      // The two weeks after that date should be available to select.
      // First day; (1 day into the 2 week range)
      const firstDayOfRange = rangeStart.clone();
      assert.equal(isOutsideRange(rangeStart.format(), datePickerSelection, firstDayOfRange), false);

      // In the middle-ish; (5 days into the 2 week range)
      const randomDayInRange = rangeStart.clone().add(5, 'days');
      assert.equal(isOutsideRange(rangeStart.format(), datePickerSelection, randomDayInRange), false);

      // At the end; (2 weeks - 1 start day = 13 days)
      const lastDayOfRange = rangeStart.clone().add(13, 'days');
      assert.equal(isOutsideRange(rangeStart.format(), datePickerSelection, lastDayOfRange), false);


      // And days outside of that range should not be able to be selected.
      // Day before the range start
      const dayBeforeFirstDayOfRange = rangeStart.clone().subtract(1, 'day');
      assert.equal(isOutsideRange(rangeStart.format(), datePickerSelection, dayBeforeFirstDayOfRange), true);

      // Day after the range end
      const dayAfterLastDayOfRange = rangeStart.clone().add(14, 'days') 
      assert.equal(isOutsideRange(rangeStart.format(), datePickerSelection, dayAfterLastDayOfRange), true);

      // Many days before the range starts
      const manyDaysBeforeFirstDayOfRange = rangeStart.clone().subtract(1, 'month') 
      assert.equal(isOutsideRange(rangeStart.format(), datePickerSelection, manyDaysBeforeFirstDayOfRange), true);

      // Many days after the range ends.
      const manyDaysAfterLastDayOfRange = rangeStart.clone().add(1, 'month') 
      assert.equal(isOutsideRange(rangeStart.format(), datePickerSelection, manyDaysAfterLastDayOfRange), true);
    });
    it('should block out two weeks that has the current date within the range', function() {
      // Start a date selection. 
      let datePickerSelection = 'startDate';

      // The user clicks a start date a few days in the past.
      const rangeStart = moment.utc().subtract(3, 'days');
      datePickerSelection = 'endDate';


      // The time range should be from the start date until the current date (which can be < 2 weeks)
      // First day; (1 day into the 3 day range)
      const firstDayOfRange = rangeStart.clone();
      assert.equal(isOutsideRange(rangeStart.format(), datePickerSelection, firstDayOfRange), false);

      // In the middle; (2 days into the 3 day range)
      const middleDayInRange = rangeStart.clone().add(1, 'days');
      assert.equal(isOutsideRange(rangeStart.format(), datePickerSelection, middleDayInRange), false);

      // At the end; (final day of three day range)
      const lastDayOfRange = rangeStart.clone().add(2, 'days');
      assert.equal(isOutsideRange(rangeStart.format(), datePickerSelection, lastDayOfRange), false);


      // And days outside of that range should not be able to be selected.
      // Day before the range start
      const dayBeforeFirstDayOfRange = rangeStart.clone().subtract(1, 'day');
      assert.equal(isOutsideRange(rangeStart.format(), datePickerSelection, dayBeforeFirstDayOfRange), true);

      // Day after the range end
      const dayAfterLastDayOfRange = rangeStart.clone().add(4, 'days') 
      assert.equal(isOutsideRange(rangeStart.format(), datePickerSelection, dayAfterLastDayOfRange), true);

      // Many days before the range starts
      const manyDaysBeforeFirstDayOfRange = rangeStart.clone().subtract(1, 'month') 
      assert.equal(isOutsideRange(rangeStart.format(), datePickerSelection, manyDaysBeforeFirstDayOfRange), true);

      // Many days after the range ends.
      const manyDaysAfterLastDayOfRange = rangeStart.clone().add(1, 'month') 
      assert.equal(isOutsideRange(rangeStart.format(), datePickerSelection, manyDaysAfterLastDayOfRange), true);
    });
  });

  describe('data fetching', function() {
    it('should fetch entrance data for january 1st, 2017 and display it', async function() {
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
          "total": 2,
          "next": null,
          "previous": null,
          "results": [
            {
              "id": "evt_789",
              "sensor_id": "snr_456",
              "doorway_id": "drw_123",
              "timestamp": "2017-01-01T19:46:53.789Z",
              "direction": 1,
            },
            {
              "id": "evt_789",
              "sensor_id": "snr_456",
              "doorway_id": "drw_123",
              "timestamp": "2017-01-01T19:41:44.022Z",
              "direction": 1,
            }
          ],
        }),
      });
      mockdate.set('1/1/2017');

      // Render the component
      const component = mount(<VisualizationSpaceDetailDailyMetricsCard space={space} />);

      // Wait for data to be fetched.
      await timeout(250);
      assert.equal(global.fetch.callCount, 1);
      const requestParameters = global.fetch.getCall(0).args;

      // Make sure the request was correctly formulated for the `America/New_York` time zone.
      // On January 1st, the offset is NYC is 5 hours.
      const hoursOffsetFromUtc = parseInt(moment.tz(space.timeZone).format('Z').split(':')[0], 10);
      assert.equal(requestParameters[1].qs.start_time, '2016-12-26T05:00:00Z');
      assert.equal(requestParameters[1].qs.end_time, '2017-01-02T05:00:00Z');

      // Verify that the correct day was auto-inserted into the date input field, such that the last
      // week will be selected.
      assert.equal(component.find('#DateInput__screen-reader-message-startDate + div').text(), '12/26/2016');
      assert.equal(component.find('#DateInput__screen-reader-message-endDate + div').text(), '01/01/2017');

      // Also, verify that the correct data was passed to the chart given what the ajax return data.
      const chartProps = component.find('.visualization-space-detail-daily-metrics-card-body').children().nodes[0].props;
      assert.deepEqual(chartProps.data, [
        {label: '12/26', value: 0},
        {label: '12/27', value: 0},
        {label: '12/28', value: 0},
        {label: '12/29', value: 0},
        {label: '12/30', value: 0},
        {label: '12/31', value: 0},
        {label: '01/01', value: 2},
      ]);
    });
    it('should fetch exit data and display it during a different part of the year', async function() {
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
          "total": 2,
          "next": null,
          "previous": null,
          "results": [
            {
              "id": "evt_789",
              "sensor_id": "snr_456",
              "doorway_id": "drw_123",
              "timestamp": "2017-09-14T19:46:53.789Z",
              "direction": -1,
            },
            {
              "id": "evt_789",
              "sensor_id": "snr_456",
              "doorway_id": "drw_123",
              "timestamp": "2017-09-14T19:41:44.022Z",
              "direction": -1,
            }
          ],
        }),
      });
      mockdate.set('9/14/2017');

      // Render the component
      const component = mount(<VisualizationSpaceDetailDailyMetricsCard space={space} />);

      // Wait for data to be fetched.
      await timeout(250);
      assert.equal(global.fetch.callCount, 1);
      const requestParameters = global.fetch.getCall(0).args;

      // Make sure the request was correctly formulated for the `America/New_York` time zone.
      // On September 14th, the offset is NYC is 4 hours.
      const hoursOffsetFromUtc = parseInt(moment.tz(space.timeZone).format('Z').split(':')[0], 10);
      assert.equal(requestParameters[1].qs.start_time, '2017-09-08T04:00:00Z');
      assert.equal(requestParameters[1].qs.end_time, '2017-09-15T04:00:00Z');

      // Verify that the correct day was auto-inserted into the date input field, such that the last
      // week will be selected.
      assert.equal(component.find('#DateInput__screen-reader-message-startDate + div').text(), '09/08/2017');
      assert.equal(component.find('#DateInput__screen-reader-message-endDate + div').text(), '09/14/2017');

      // Also, verify that the correct data was passed to the chart given what the ajax return data.
      const chartProps = component.find('.visualization-space-detail-daily-metrics-card-body').children().nodes[0].props;
      assert.deepEqual(chartProps.data, [
        {label: '09/08', value: 0},
        {label: '09/09', value: 0},
        {label: '09/10', value: 0},
        {label: '09/11', value: 0},
        {label: '09/12', value: 0},
        {label: '09/13', value: 0},
        {label: '09/14', value: 2},
      ]);
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
          "total": 2,
          "next": null,
          "previous": null,
          "results": [
            {
              "id": "evt_789",
              "sensor_id": "snr_456",
              "doorway_id": "drw_123",
              "timestamp": "2017-09-14T19:46:53.789Z",
              "direction": -1,
            },
            {
              "id": "evt_789",
              "sensor_id": "snr_456",
              "doorway_id": "drw_123",
              "timestamp": "2017-09-14T19:41:44.022Z",
              "direction": -1,
            }
          ],
        }),
      });
      mockdate.set('9/14/2017');

      // Render the component
      const component = mount(<VisualizationSpaceDetailDailyMetricsCard space={space} />);

      // Wait for data to be fetched.
      await timeout(250);
      assert.equal(global.fetch.callCount, 1);
      const requestParameters = global.fetch.getCall(0).args;

      // Make sure the request was correctly formulated for the `America/Los_Angeles` time zone.
      // On September 14th, the offset in LA is 7 hours.
      const hoursOffsetFromUtc = parseInt(moment.tz(space.timeZone).format('Z').split(':')[0], 10);
      assert.equal(requestParameters[1].qs.start_time, '2017-09-08T07:00:00Z');
      assert.equal(requestParameters[1].qs.end_time, '2017-09-15T07:00:00Z');

      // Verify that the correct day was auto-inserted into the date input field, such that the last
      // week will be selected.
      assert.equal(component.find('#DateInput__screen-reader-message-startDate + div').text(), '09/08/2017');
      assert.equal(component.find('#DateInput__screen-reader-message-endDate + div').text(), '09/14/2017');

      // Also, verify that the correct data was passed to the chart given what the ajax return data.
      const chartProps = component.find('.visualization-space-detail-daily-metrics-card-body').children().nodes[0].props;
      assert.deepEqual(chartProps.data, [
        {label: '09/08', value: 0},
        {label: '09/09', value: 0},
        {label: '09/10', value: 0},
        {label: '09/11', value: 0},
        {label: '09/12', value: 0},
        {label: '09/13', value: 0},
        {label: '09/14', value: 2},
      ]);
    });
  });

  // TODO: more tests could be used here. Possibly something that actually interacts with the
  // datepicker rather than just setting state (tried it, the css selectors I was tring weren't
  // working), maybe a test that tries to switch the type of metric displayed and makes sure the
  // data is refetched? Just some ideas.

  it('should correctly refetch data when sensor selected date range is changed', async function() {
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
        "total": 2,
        "next": null,
        "previous": null,
        "results": [
          {
            "id": "evt_789",
            "sensor_id": "snr_456",
            "doorway_id": "drw_123",
            "timestamp": "2017-01-01T19:46:53.789Z",
            "direction": 1,
          },
          {
            "id": "evt_789",
            "sensor_id": "snr_456",
            "doorway_id": "drw_123",
            "timestamp": "2017-01-01T19:41:44.022Z",
            "direction": 1,
          }
        ],
      }),
    });
    mockdate.set('1/1/2017');

    // Render the component
    const component = mount(<VisualizationSpaceDetailDailyMetricsCard space={space} />);

    // Wait for data to be fetched.
    await timeout(250);
    assert.equal(global.fetch.callCount, 1);

    // Update selected dates, as if selected by date picker.
    component.setState({
      startDate: '2017-11-01T00:00:00Z',
      endDate: '2017-11-07T00:00:00Z',
    });

    // Update data stored within tbe component.
    global.fetch = sinon.stub().resolves({
      ok: true,
      status: 200,
      clone() { return this; },
      json: () => Promise.resolve({
        "total": 2,
        "next": null,
        "previous": null,
        "results": [
          {
            "id": "evt_789",
            "sensor_id": "snr_456",
            "doorway_id": "drw_123",
            "timestamp": "2017-11-07T19:46:53.789Z",
            "direction": 1,
          },
          {
            "id": "evt_789",
            "sensor_id": "snr_456",
            "doorway_id": "drw_123",
            "timestamp": "2017-11-07T19:41:44.022Z",
            "direction": 1,
          }
        ],
      }),
    });
    await component.instance().fetchData();

    // Assert data was fetched.
    assert.equal(global.fetch.callCount, 1);
    const requestParameters = global.fetch.getCall(0).args;

    // Make sure the request was correctly formulated for the `America/New_York` time zone.
    // On January 1st, the offset is NYC is 5 hours.
    const hoursOffsetFromUtc = parseInt(moment.tz(space.timeZone).format('Z').split(':')[0], 10);
    assert.equal(requestParameters[1].qs.start_time, '2017-11-01T05:00:00Z');
    assert.equal(requestParameters[1].qs.end_time, '2017-11-08T05:00:00Z');

    // Verify that the correct day was auto-inserted into the date input field, such that the last
    // week will be selected.
    assert.equal(component.find('#DateInput__screen-reader-message-startDate + div').text(), '11/01/2017');
    assert.equal(component.find('#DateInput__screen-reader-message-endDate + div').text(), '11/07/2017');

    // Also, verify that the correct data was passed to the chart given what the ajax return data.
    const chartProps = component.find('.visualization-space-detail-daily-metrics-card-body').children().nodes[0].props;
    assert.deepEqual(chartProps.data, [
      {label: '11/01', value: 0},
      {label: '11/02', value: 0},
      {label: '11/03', value: 0},
      {label: '11/04', value: 0},
      {label: '11/05', value: 0},
      {label: '11/06', value: 0},
      {label: '11/07', value: 2},
    ]);
  });
});
