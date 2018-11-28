import React from 'react';
import { mount, shallow } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';
import mockdate from 'mockdate';

import moment from 'moment';
import 'moment-timezone';

import ExploreSpaceDetailUtilizationCard, { LOADING, EMPTY, VISIBLE, REQUIRES_CAPACITY, ERROR } from './index';

import { DEFAULT_TIME_SEGMENT_GROUP, DEFAULT_TIME_SEGMENT } from '../../helpers/time-segments/index';

function timeout(delay) {
  return new Promise(r => setTimeout(r, delay));
}

describe('space utilization card', function() {
  afterEach(() => mockdate.reset())

  it('should render explore space utilization card (smoke test)', async function() {
    // Mock the data fetching call, and the current date so that we can assert properly.
    global.fetch = sinon.stub().resolves({
      ok: true,
      status: 200,
      clone() { return this; },
      json: () => Promise.resolve({
        "total": 16,
        "next": null,
        "previous": null,
        "results": [
          {
            "timestamp": "2017-11-07T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-11-07T04:00:00Z",
              "end": "2017-11-08T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-06T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-11-06T04:00:00Z",
              "end": "2017-11-07T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-05T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-11-05T04:00:00Z",
              "end": "2017-11-06T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-04T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-11-04T04:00:00Z",
              "end": "2017-11-05T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-03T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-11-03T04:00:00Z",
              "end": "2017-11-04T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-02T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-11-02T04:00:00Z",
              "end": "2017-11-03T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-01T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-11-01T04:00:00Z",
              "end": "2017-11-02T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-31T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-31T04:00:00Z",
              "end": "2017-11-01T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 3,
                "events": 5,
                "entrances": 3,
                "exits": 2
              }
            }
          },
          {
            "timestamp": "2017-10-30T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-10-30T04:00:00Z",
              "end": "2017-10-31T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-29T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-10-29T04:00:00Z",
              "end": "2017-10-30T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-28T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-10-28T04:00:00Z",
              "end": "2017-10-29T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-27T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-27T04:00:00Z",
              "end": "2017-10-28T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-26T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-26T04:00:00Z",
              "end": "2017-10-27T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-25T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-25T04:00:00Z",
              "end": "2017-10-26T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-24T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-24T04:00:00Z",
              "end": "2017-10-25T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-23T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-23T04:00:00Z",
              "end": "2017-10-24T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 3,
                "events": 5,
                "entrances": 3,
                "exits": 2
              }
            }
          },
        ]
      }),
    });

    // Render the component
    const component = shallow(<ExploreSpaceDetailUtilizationCard
      space={{
        id: 'spc_1',
        name: 'My Space',
        currentCount: 2,
        capacity: 5,
        timeZone: 'America/New_York',
      }}
      startDate="2016-12-25T00:00:00-05:00"
      endDate="2017-01-01T00:00:00-05:00"
      timeSegmentGroup={DEFAULT_TIME_SEGMENT_GROUP}
      timeSegment={DEFAULT_TIME_SEGMENT}
    />);
    component.instance().componentDidMount();

    // Ensure that the component starts out in a loading state
    assert.equal(component.find('.explore-space-detail-utilization-card-body-info span').text(), 'Generating Data . . .');

    await timeout(0);

    // Make sure a request was made
    assert.equal(global.fetch.callCount, 1);

    // And that the utilization metrics should be visible an are actually rendered.
    assert.equal(component.state().view, VISIBLE);
  });
  it('should render explore space utilization with a space without a capacity', async function() {
    // Mock the data fetching call, and the current date so that we can assert properly.
    global.fetch = sinon.stub().resolves({
      ok: true,
      status: 200,
      clone() { return this; },
      json: () => Promise.resolve({
        "total": 16,
        "next": null,
        "previous": null,
        "results": [
          {
            "timestamp": "2017-11-07T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-11-07T04:00:00Z",
              "end": "2017-11-08T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-06T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-11-06T04:00:00Z",
              "end": "2017-11-07T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-05T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-11-05T04:00:00Z",
              "end": "2017-11-06T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-04T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-11-04T04:00:00Z",
              "end": "2017-11-05T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-03T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-11-03T04:00:00Z",
              "end": "2017-11-04T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-02T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-11-02T04:00:00Z",
              "end": "2017-11-03T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-01T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-11-01T04:00:00Z",
              "end": "2017-11-02T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-31T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-31T04:00:00Z",
              "end": "2017-11-01T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 3,
                "events": 5,
                "entrances": 3,
                "exits": 2
              }
            }
          },
          {
            "timestamp": "2017-10-30T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-10-30T04:00:00Z",
              "end": "2017-10-31T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-29T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-10-29T04:00:00Z",
              "end": "2017-10-30T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-28T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-10-28T04:00:00Z",
              "end": "2017-10-29T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-27T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-27T04:00:00Z",
              "end": "2017-10-28T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-26T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-26T04:00:00Z",
              "end": "2017-10-27T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-25T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-25T04:00:00Z",
              "end": "2017-10-26T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-24T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-24T04:00:00Z",
              "end": "2017-10-25T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-23T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-23T04:00:00Z",
              "end": "2017-10-24T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 3,
                "events": 5,
                "entrances": 3,
                "exits": 2
              }
            }
          },
        ]
      }),
    });

    // Render the component
    const component = shallow(<ExploreSpaceDetailUtilizationCard
      space={{
        id: 'spc_1',
        name: 'My Space',
        currentCount: 2,
        capacity: null, /* no capacity! */
        timeZone: 'America/New_York',
      }}

      // Set by filter bar
      startDate="2016-12-25T00:00:00-05:00"
      endDate="2017-01-01T00:00:00-05:00"
      timeSegmentGroup={DEFAULT_TIME_SEGMENT_GROUP}
      timeSegment={DEFAULT_TIME_SEGMENT}
    />);
    component.instance().componentDidMount();

    // The card transitions into the `REQUIRES_CAPACITY` state since no capacity was specified
    assert.equal(component.state().view, REQUIRES_CAPACITY);
  });

  it('should render space utilization card, and refetch data when the capacity of a space is changed', async function() {
    // Mock the data fetching call, and the current date so that we can assert properly.
    global.fetch = sinon.stub().resolves({
      ok: true,
      status: 200,
      clone() { return this; },
      json: () => Promise.resolve({
        "total": 16,
        "next": null,
        "previous": null,
        "results": [
          {
            "timestamp": "2017-11-07T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-11-07T04:00:00Z",
              "end": "2017-11-08T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-06T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-11-06T04:00:00Z",
              "end": "2017-11-07T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-05T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-11-05T04:00:00Z",
              "end": "2017-11-06T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-04T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-11-04T04:00:00Z",
              "end": "2017-11-05T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-03T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-11-03T04:00:00Z",
              "end": "2017-11-04T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-02T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-11-02T04:00:00Z",
              "end": "2017-11-03T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-11-01T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-11-01T04:00:00Z",
              "end": "2017-11-02T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-31T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-31T04:00:00Z",
              "end": "2017-11-01T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 3,
                "events": 5,
                "entrances": 3,
                "exits": 2
              }
            }
          },
          {
            "timestamp": "2017-10-30T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-10-30T04:00:00Z",
              "end": "2017-10-31T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-29T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-10-29T04:00:00Z",
              "end": "2017-10-30T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-28T04:00:00Z",
            "count": 1,
            "interval": {
              "start": "2017-10-28T04:00:00Z",
              "end": "2017-10-29T03:59:59Z",
              "analytics": {
                "min": 1,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-27T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-27T04:00:00Z",
              "end": "2017-10-28T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 1,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-26T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-26T04:00:00Z",
              "end": "2017-10-27T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-25T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-25T04:00:00Z",
              "end": "2017-10-26T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-24T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-24T04:00:00Z",
              "end": "2017-10-25T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 0,
                "events": 0,
                "entrances": 0,
                "exits": 0
              }
            }
          },
          {
            "timestamp": "2017-10-23T04:00:00Z",
            "count": 0,
            "interval": {
              "start": "2017-10-23T04:00:00Z",
              "end": "2017-10-24T03:59:59Z",
              "analytics": {
                "min": 0,
                "max": 3,
                "events": 5,
                "entrances": 3,
                "exits": 2
              }
            }
          },
        ]
      }),
    });
    mockdate.set(moment('2017-01-01T00:00:00-05:00'));

    const SPACE = {
      id: 'spc_1',
      name: 'My Space',
      currentCount: 2,
      capacity: 5,
      timeZone: 'America/New_York',
    };

    // Render the component
    const component = shallow(<ExploreSpaceDetailUtilizationCard
      space={SPACE}

      // Set by filter bar
      startDate="2016-12-25T00:00:00-05:00"
      endDate="2017-01-01T00:00:00-05:00"
      timeSegmentGroup={DEFAULT_TIME_SEGMENT_GROUP}
      timeSegment={DEFAULT_TIME_SEGMENT}
    />);
    component.instance().componentDidMount();

    // Ensure that the component starts out in a loading state
    assert.equal(component.find('.explore-space-detail-utilization-card-body-info span').text(), 'Generating Data . . .');

    await timeout(100);

    // Make sure the right request was made
    assert.equal(global.fetch.callCount, 1);

    // And that the utilization metrics should be visible
    assert.equal(component.state().view, VISIBLE);

    // Then, change the capacity of the space
    component.setProps({space: {...SPACE, capacity: 101}});

    // Which should cause the card to re-calculate its view and move into a loading state.
    assert.equal(component.state().view, LOADING);
  });
});