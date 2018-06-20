import * as React from 'react';
import { mount, shallow } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';
import moment from 'moment';

import { InsightsSpaceList } from './index';

const MDASH = String.fromCharCode(8212);

function timeout(delay) {
  return new Promise(r => setTimeout(r, delay));
}

describe('insights space list', function() {
  // Stub out the data fetching api call. Use the same data for each test for now and if this needs
  // to change later I can address then.
  beforeEach(() => {
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      status: 200,
      clone() { return this; },
      json: () => Promise.resolve({
        total: 3,
        next: null,
        results: [
          {
            count: 0,
            interval: {
              start: "2017-01-01T03:55:00Z",
              end: "2017-01-01T03:59:59Z",
              analytics: {min: 0, max: 0},
            },
            timestamp: "2017-01-01T03:55:00Z",
          },
          {
            count: 1,
            interval: {
              start: "2017-01-01T04:00:00Z",
              end: "2017-01-01T04:05:00Z",
              analytics: {min: 0, max: 1},
            },
            timestamp: "2017-01-01T04:00:00Z",
          },
          {
            count: 2,
            interval: {
              start: "2017-01-01T04:05:00Z",
              end: "2017-01-01T04:10:00Z",
              analytics: {min: 0, max: 2},
            },
            timestamp: "2017-01-01T04:00:00Z",
          },
        ],
      }),
    });
  });
  afterEach(() => global.fetch.restore());

  it('should render insights list space list (smoke test)', async function() {
    // Render the component
    const component = mount(<InsightsSpaceList
      spaces={{
        filters: {search: ''},
        data: [
          {
            id: 'spc_1',
            spaceType: 'space',
            name: 'My Space',
            currentCount: 2,
            capacity: 5,
            timeZone: 'America/New_York',
          },
        ],
        events: {},
      }}
      activeModal={{name: null, data: null}}
    />);

    // Ensure that a single space was rendered
    assert.equal(component.find('.insights-space-list-item.body-row').length, 1);

    // No utilization should be rendered, a dash should be rendered instead.
    assert.equal(
      component.find('.insights-space-list-item.body-row').first().find('.percentage-bar-text').text(),
      MDASH
    );

    // Wait for fetch call to complete.
    await timeout(100);

    // Fetch the first space rendered. Ensure that it's found.
    const firstSpace = component.find('.insights-space-list-item.body-row').first();
    assert(firstSpace);

    // Verify the space's name was rendered
    assert.equal(firstSpace.find('.insights-space-list-item-name').text(), 'My Space');

    // Verify the capacity was rendered.
    assert.equal(firstSpace.find('.insights-space-list-item-capacity').text(), '5');
  });
  it(`should render a set capacity link if the space doesn't have a capacity set`, async function() {
    // Render the component
    const component = shallow(<InsightsSpaceList
      spaces={{
        filters: {search: ''},
        data: [
          {
            id: 'spc_1',
            spaceType: 'space',
            name: 'My Space',
            currentCount: 2,
            capacity: null, /* no capacity */
            timeZone: 'America/New_York',
          },
        ],
        events: {},
      }}
      activeModal={{name: null, data: null}}
    />);

    // Ensure that a single space was rendered
    assert.equal(component.find('.insights-space-list-item.body-row').length, 1);

    // Ensure that the single space has a set capacity link
    assert.equal(
      component.find('.insights-space-list-item.body-row .insights-space-list-item-capacity a').first().text(),
      'Set'
    );
  });
  it(`should show an error in the error bar when something bad happens in fetchData`, async function() {
    // Ensure that the request to the server fails.
    global.fetch.restore();
    sinon.stub(global, 'fetch').rejects(new Error('Fail!'));

    // Render the component
    const component = mount(<InsightsSpaceList
      spaces={{
        filters: {search: ''},
        data: [
          {
            id: 'spc_1',
            spaceType: 'space',
            name: 'My Space',
            currentCount: 2,
            capacity: null, /* no capacity */
            timeZone: 'America/New_York',
          },
        ],
        events: {},
      }}
      activeModal={{name: null, data: null}}
    />);

    // Wait for the promise to reject.
    await timeout(50);

    // Ensure that the error bar shows an error
    assert.equal(component.find('.error-bar-message').text(), 'Could not fetch space counts: Fail!');

    // Ensure that all the filters are disabled
    assert.equal(component.find('.insights-space-list-search-box').props().disabled, true);
    assert.equal(component.find('.insights-space-list-time-segment-selector > .disabled').length, 1);
    assert.equal(component.find('.insights-space-list-duration-selector > .disabled').length, 1);
  });
  it('should only ever have one data fetching operation going at once', async function() {
    // Render the component
    const component = shallow(<InsightsSpaceList
      spaces={{
        filters: {search: ''},
        data: [
          {
            id: 'spc_1',
            spaceType: 'space',
            name: 'My Space',
            currentCount: 2,
            capacity: null, /* no capacity */
            timeZone: 'America/New_York',
          },
        ],
        events: {},
      }}
      activeModal={{name: null, data: null}}
    />);

    const instance = component.instance();

    // Start the data fetching
    instance.fetchData();

    // Verify that the data fetching lock is on
    assert.equal(instance.fetchDataLock, true);

    // Also verify that fetch has been called.
    assert.equal(global.fetch.callCount, 1);

    // Fetch data again.
    instance.fetchData();

    // Verify that the data fetching lock is still on
    assert.equal(instance.fetchDataLock, true);

    // And that fetch hasn't been called again (in other words, the second `fetchData` call was a
    // noop)
    assert.equal(global.fetch.callCount, 1);
  });
  it('should ensure that a utilization bar that is over 100% only ever renders at 100% (and never overflows)', async function() {
    // Render the component
    const component = mount(<InsightsSpaceList
      spaces={{
        filters: {search: ''},
        data: [
          {
            id: 'spc_1',
            spaceType: 'space',
            name: 'My Space',
            currentCount: 2,
            capacity: 5,
            timeZone: 'America/New_York',
          },
        ],
        events: {},
      }}
      activeModal={{name: null, data: null}}
    />);

    // Set capacities to known values. This is important to make sure the sorting order tests work
    // (and to make it easy to validate if they work)
    component.setState({
      spaceUtilizations: {
        spc_1: 1.5, /* 150% utilized, which is > 100% */
      },
    });

    // Ensure that a single space was rendered
    assert.equal(component.find('.insights-space-list-item.body-row').length, 1);

    // Fetch the first space rendered. Ensure that it's found.
    const firstSpace = component.find('.insights-space-list-item.body-row').first();
    assert(firstSpace);

    // Ensure that the utilization percentage was not overflowing the bounds of the container.
    assert.equal(
      firstSpace.find('.percentage-bar-colored-section').props().style.width,
      '100%'
    );
  });
  it('should disable filters when the space insights card is loading', async function() {
    // Render the component
    const component = mount(<InsightsSpaceList
      spaces={{
        filters: {search: ''},
        data: [
          {
            id: 'spc_1',
            spaceType: 'space',
            name: 'My Space',
            currentCount: 2,
            capacity: 5,
            timeZone: 'America/New_York',
          },
        ],
        events: {},
      }}
      activeModal={{name: null, data: null}}
    />);

    // Put the component into a loading state
    component.setState({ view: 'LOADING' });

    // Make sure filter selectors are disabled - we don't want people changing the filters while
    // loading!
    assert.equal(component.find('.insights-space-list-time-segment-selector > .disabled').length, 1);
    assert.equal(component.find('.insights-space-list-duration-selector > .disabled').length, 1);
  });

  describe('sorting of spaces', function() {
    it(`should by default sort spaces in order of name decending`, async function() {
      // Render the component
      const component = shallow(<InsightsSpaceList
        spaces={{
          filters: {search: ''},
          data: [
            {
              id: 'spc_1',
              spaceType: 'space',
              name: 'aa My Space',
              currentCount: 4,
              capacity: 5,
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_2',
              spaceType: 'space',
              name: 'mm My Space',
              currentCount: 0,
              capacity: 20,
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_3',
              spaceType: 'space',
              name: 'zz My Space',
              currentCount: 2,
              capacity: 2,
              timeZone: 'America/New_York',
            },
          ],
          events: {},
        }}
        activeModal={{name: null, data: null}}
      />);

      // Ensure that two spaces were rendered
      assert.equal(component.find('.insights-space-list-item.body-row').length, 3);

      // By default, the spaces should be sorted decending - starting with `aa` and ending with `zz`
      const spaces = component.find('.insights-space-list-item.body-row');
      assert.equal(spaces.at(0).find('.insights-space-list-item-name').text(), 'aa My Space');
      assert.equal(spaces.at(1).find('.insights-space-list-item-name').text(), 'mm My Space');
      assert.equal(spaces.at(2).find('.insights-space-list-item-name').text(), 'zz My Space');
    });
    it(`should be able to invert space order by name by clicking on the header in the space list`, async function() {
      // Render the component
      const component = mount(<InsightsSpaceList
        spaces={{
          filters: {search: ''},
          data: [
            {
              id: 'spc_1',
              spaceType: 'space',
              name: 'aa My Space',
              currentCount: 4,
              capacity: 5,
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_2',
              spaceType: 'space',
              name: 'mm My Space',
              currentCount: 0,
              capacity: 20,
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_3',
              spaceType: 'space',
              name: 'zz My Space',
              currentCount: 2,
              capacity: 2,
              timeZone: 'America/New_York',
            },
          ],
          events: {},
        }}
        activeModal={{name: null, data: null}}
      />);

      // Ensure that three spaces were rendered
      assert.equal(component.find('.insights-space-list-item.body-row').length, 3);

      // Click the header for the space column
      component
        .find('.sortable-grid-header-item').first()
        .find('.sortable-grid-header-item-label').simulate('click');

      // Now, the sort order should be reversed, starting at `zz` at top and going to `aa` at bottom
      const spaces = component.find('.insights-space-list-item.body-row');
      assert.equal(spaces.at(0).find('.insights-space-list-item-name').text(), 'zz My Space');
      assert.equal(spaces.at(1).find('.insights-space-list-item-name').text(), 'mm My Space');
      assert.equal(spaces.at(2).find('.insights-space-list-item-name').text(), 'aa My Space');
    });
    it(`should be able to sort by capacity ascending if the capacity header is clicked, and switch to decending if the header is clicked again`, async function() {
      // Render the component
      const component = mount(<InsightsSpaceList
        spaces={{
          filters: {search: ''},
          data: [
            {
              id: 'spc_1',
              spaceType: 'space',
              name: 'aa My Space',
              currentCount: 4,
              capacity: 5,
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_2',
              spaceType: 'space',
              name: 'mm My Space',
              currentCount: 0,
              capacity: 20,
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_3',
              spaceType: 'space',
              name: 'zz My Space',
              currentCount: 2,
              capacity: 2,
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_4',
              spaceType: 'space',
              name: 'rr My Space',
              currentCount: 1,
              capacity: null, /* no capacity */
              timeZone: 'America/New_York',
            },
          ],
          events: {},
        }}
        activeModal={{name: null, data: null}}
      />);

      // Ensure that three spaces were rendered
      assert.equal(component.find('.insights-space-list-item.body-row').length, 4);

      // Click the header for the space column
      component
        .find('.sortable-grid-header-item').at(1) /* Capacity */
        .find('.sortable-grid-header-item-label').simulate('click');

      // The spaces should be sorted such that the one that has the largest capacity is first (mm)
      // and then the smaller capacities (aa then zz). Finally, rr should be at the end since it
      // doesn't have a capacity.
      const spaces = component.find('.insights-space-list-item.body-row');
      assert.equal(spaces.at(0).find('.insights-space-list-item-name').text(), 'mm My Space');
      assert.equal(spaces.at(1).find('.insights-space-list-item-name').text(), 'aa My Space');
      assert.equal(spaces.at(2).find('.insights-space-list-item-name').text(), 'zz My Space');
      assert.equal(spaces.at(3).find('.insights-space-list-item-name').text(), 'rr My Space');

      // Click the header for the space column again, inverting the sort order.
      component
        .find('.sortable-grid-header-item').at(1) /* Capacity */
        .find('.sortable-grid-header-item-label').simulate('click');

      // The spaces should be sorted such that the one without a capacity is first, then the one
      // that has the smallest capacity (zz), and then the larger capacities (aa then mm).
      const spacesInverse = component.find('.insights-space-list-item.body-row');
      assert.equal(spacesInverse.at(0).find('.insights-space-list-item-name').text(), 'rr My Space');
      assert.equal(spacesInverse.at(1).find('.insights-space-list-item-name').text(), 'zz My Space');
      assert.equal(spacesInverse.at(2).find('.insights-space-list-item-name').text(), 'aa My Space');
      assert.equal(spacesInverse.at(3).find('.insights-space-list-item-name').text(), 'mm My Space');
    });
    it(`should be able to sort by utilization ascending if the utilization header is clicked, and switch to decending if the header is clicked again`, async function() {
      // Render the component
      const component = mount(<InsightsSpaceList
        spaces={{
          filters: {search: ''},
          data: [
            {
              id: 'spc_1',
              spaceType: 'space',
              name: 'My Space 1',
              currentCount: 4,
              capacity: 5,
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_2',
              spaceType: 'space',
              name: 'My Space 2',
              currentCount: 0,
              capacity: 20,
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_3',
              spaceType: 'space',
              name: 'My Space 3',
              currentCount: 2,
              capacity: 2,
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_4',
              spaceType: 'space',
              name: 'My Space 4',
              currentCount: 1,
              capacity: null, /* no capacity */
              timeZone: 'America/New_York',
            },
          ],
          events: {},
        }}
        activeModal={{name: null, data: null}}
      />);

      // Set capacities to known values. This is important to make sure the sorting order tests work
      // (and to make it easy to validate if they work)
      component.setState({
        spaceUtilizations: {
          spc_2: 0.1, /* mm My Space */
          spc_3: 0.2, /* zz My Space */
          spc_1: 0.8, /* aa My Space */
          spc_4: undefined, /* rr My Space */
        },
      });

      // Ensure that three spaces were rendered
      assert.equal(component.find('.insights-space-list-item.body-row').length, 4);

      // Click the header for the space column
      component
        .find('.sortable-grid-header-item').at(2) /* Utilization */
        .find('.sortable-grid-header-item-label').simulate('click');

      // The spaces should be sorted such that the one that has the largest utilization is first, 
      // the smallest utilization is in the middle, and any spaces without a capacity are last.
      const spaces = component.find('.insights-space-list-item.body-row');
      assert.equal(spaces.at(0).find('.insights-space-list-item-name').text(), 'My Space 1')
      assert.equal(spaces.at(1).find('.insights-space-list-item-name').text(), 'My Space 3');
      assert.equal(spaces.at(2).find('.insights-space-list-item-name').text(), 'My Space 2');
      assert.equal(spaces.at(3).find('.insights-space-list-item-name').text(), 'My Space 4');

      // Click the header for the space column again, inverting the sort order.
      component
        .find('.sortable-grid-header-item').at(2) /* Utilization */
        .find('.sortable-grid-header-item-label').simulate('click');

      // The spaces should be sorted such that the one that has the  utilization is first, 
      // the smallest utilization is in the middle, and any spaces without a capacity are last.
      const spacesInverse = component.find('.insights-space-list-item.body-row');
      assert.equal(spacesInverse.at(0).find('.insights-space-list-item-name').text(), 'My Space 4');
      assert.equal(spacesInverse.at(1).find('.insights-space-list-item-name').text(), 'My Space 2');
      assert.equal(spacesInverse.at(2).find('.insights-space-list-item-name').text(), 'My Space 3');
      assert.equal(spacesInverse.at(3).find('.insights-space-list-item-name').text(), 'My Space 1');
    });
  });

  describe('setting capacity', function() {
    it(`should be able to click the 'set capacity' link to set capacity on space, which causes a data refetch`, async function() {
      const onOpenModal = sinon.stub();
      const onSetCapacity = sinon.stub();

      const SPACE = {
        id: 'spc_1',
        spaceType: 'space',
        name: 'My Space',
        currentCount: 2,
        capacity: null, /* no capacity */
        timeZone: 'America/New_York',
      };

      // Render the component
      const component = mount(<InsightsSpaceList
        spaces={{
          filters: {search: ''},
          data: [SPACE],
          events: {},
        }}
        activeModal={{name: null, data: null}}
        onOpenModal={onOpenModal}
        onSetCapacity={onSetCapacity}
      />);

      // Ensure that a single space was rendered
      assert.equal(component.find('.insights-space-list-item.body-row').length, 1);

      // Click on the 'set capacity' link
      const stopPropagation = sinon.spy();
      component
        .find('.insights-space-list-item-capacity a')
        .first()
        .simulate('click', {stopPropagation});

      // Verify that this should open the set capacity modal, passing the space as an argument
      assert.equal(onOpenModal.callCount, 1);
      assert.deepEqual(
        onOpenModal.firstCall.args,
        ['set-capacity', {space: SPACE}]
      );

      // Submit the modal
      component.setProps({activeModal: {name: 'set-capacity', data: {space: SPACE}}});
      component.find('InsightsSetCapacityModal').props().onSubmit();

      // Verify that the component goes back into a loading state, to refetch data now that the
      // capacity has been set (changing the capacity probably means a change in utilization)
      assert.equal(component.state().view, 'LOADING');
    });
  });

  describe('rendering phrases correctly', function() {
    it(`should render phrase properly when a number of unfiltered spaces are shown`, async function() {
      // Render the component
      const component = mount(<InsightsSpaceList
        spaces={{
          filters: {search: ''},
          data: [
            {
              id: 'spc_1',
              spaceType: 'space',
              name: 'My Space',
              currentCount: 2,
              capacity: 5,
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_2',
              spaceType: 'space',
              name: 'My Space 2',
              currentCount: 2,
              capacity: 5,
              timeZone: 'America/New_York',
            },
          ],
          events: {},
        }}
        activeModal={{name: null, data: null}}
      />);

      // For this test, whether the utilization data has been loaded or not is not important. So, to
      // make the test faster, skip it.
      component.setState({view: 'VISIBLE'});

      // Ensure that the header uses the right language to describe the 2-space unfiltered
      // scenario.
      assert.equal(
        component.find('.insights-space-list-summary-header').text(),
        'Your 2 spaces have seen 0 visitors during open hours this past week'
      );
    });
    it(`should render phrase properly when a simgle unfiltered space is shown`, async function() {
      // Render the component
      const component = mount(<InsightsSpaceList
        spaces={{
          filters: {search: ''},
          data: [
            {
              id: 'spc_1',
              spaceType: 'space',
              name: 'My Space',
              currentCount: 2,
              capacity: 5,
              timeZone: 'America/New_York',
            },
          ],
          events: {},
        }}
        activeModal={{name: null, data: null}}
      />);

      // For this test, whether the utilization data has been loaded or not is not important. So, to
      // make the test faster, skip it.
      component.setState({view: 'VISIBLE'});

      // Ensure that the header uses the right language to describe the 1-space unfiltered
      // scenario.
      assert.equal(
        component.find('.insights-space-list-summary-header').text(),
        'Your 1 space has seen 0 visitors during open hours this past week'
      );
    });
    it(`should render phrase properly when two filtered spaces are shown`, async function() {
      // Render the component
      const component = mount(<InsightsSpaceList
        spaces={{
          filters: {search: 'My'},
          data: [
            {
              id: 'spc_1',
              spaceType: 'space',
              name: 'My Space',
              currentCount: 2,
              capacity: 5,
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_2',
              spaceType: 'space',
              name: 'My Space 2',
              currentCount: 2,
              capacity: 5,
              timeZone: 'America/New_York',
            },
          ],
          events: {},
        }}
        activeModal={{name: null, data: null}}
      />);

      // For this test, whether the utilization data has been loaded or not is not important. So, to
      // make the test faster, skip it.
      component.setState({view: 'VISIBLE'});

      // Ensure that the header uses the right language to describe the 2-space filtered
      // scenario.
      assert.equal(
        component.find('.insights-space-list-summary-header').text(),
        'These 2 spaces have seen 0 visitors during open hours this past week'
      );
    });
    it(`should render phrase properly when a single filtered space is shown`, async function() {
      // Render the component
      const component = mount(<InsightsSpaceList
        spaces={{
          filters: {search: 'My'},
          data: [
            {
              id: 'spc_1',
              spaceType: 'space',
              name: 'My Space',
              currentCount: 2,
              capacity: 5,
              timeZone: 'America/New_York',
            },
          ],
          events: {},
        }}
        activeModal={{name: null, data: null}}
      />);

      // For this test, whether the utilization data has been loaded or not is not important. So, to
      // make the test faster, skip it.
      component.setState({view: 'VISIBLE'});

      // Ensure that the header uses the right language to describe the 1-space filtered
      // scenario.
      assert.equal(
        component.find('.insights-space-list-summary-header').text(),
        'This 1 space has seen 0 visitors during open hours this past week'
      );
    });
    it(`should render phrase properly when two filtered spaces are shown and a floor is picked`, async function() {
      // Render the component
      const component = mount(<InsightsSpaceList
        spaces={{
          filters: {
            search: 'My',
            parent: 'spc_3',
          },
          data: [
            {
              id: 'spc_1',
              name: 'My Space',
              currentCount: 2,
              capacity: 5,
              parentId: 'spc_3',
              spaceType: 'space',
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_2',
              name: 'My Space 2',
              currentCount: 2,
              capacity: 5,
              parentId: 'spc_3',
              spaceType: 'space',
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_3',
              name: 'My Floor',
              spaceType: 'floor',
              timeZone: 'America/New_York',
            },
          ],
          events: {},
        }}
        activeModal={{name: null, data: null}}
      />);

      // For this test, whether the utilization data has been loaded or not is not important. So, to
      // make the test faster, skip it.
      component.setState({view: 'VISIBLE'});

      // Ensure that the header uses the right language to describe the 2-space filtered
      // scenario.
      assert.equal(
        component.find('.insights-space-list-summary-header').text(),
        'These 2 spaces on My Floor have seen 0 visitors during open hours this past week'
      );
    });
    it(`should render phrase properly when two filtered spaces are shown and a building is picked`, async function() {
      // Render the component
      const component = mount(<InsightsSpaceList
        spaces={{
          filters: {
            search: 'My',
            parent: 'spc_3',
          },
          data: [
            {
              id: 'spc_1',
              name: 'My Space',
              currentCount: 2,
              capacity: 5,
              parentId: 'spc_3',
              spaceType: 'space',
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_2',
              name: 'My Space 2',
              currentCount: 2,
              capacity: 5,
              parentId: 'spc_3',
              spaceType: 'space',
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_3',
              name: 'My Building',
              spaceType: 'building',
              timeZone: 'America/New_York',
            },
          ],
          events: {},
        }}
        activeModal={{name: null, data: null}}
      />);

      // For this test, whether the utilization data has been loaded or not is not important. So, to
      // make the test faster, skip it.
      component.setState({view: 'VISIBLE'});

      // Ensure that the header uses the right language to describe the 2-space filtered
      // scenario.
      assert.equal(
        component.find('.insights-space-list-summary-header').text(),
        'These 2 spaces in My Building have seen 0 visitors during open hours this past week'
      );
    });
    it(`should render phrase properly when a single filtered space is shown and a campus is picked`, async function() {
      // Render the component
      const component = mount(<InsightsSpaceList
        spaces={{
          filters: {
            search: 'My 2',
            parent: 'spc_3',
          },
          data: [
            {
              id: 'spc_1',
              name: 'My Space',
              currentCount: 2,
              capacity: 5,
              parentId: 'spc_3',
              spaceType: 'space',
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_2',
              name: 'My Space 2',
              currentCount: 2,
              capacity: 5,
              parentId: 'spc_3',
              spaceType: 'space',
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_3',
              name: 'My Campus',
              spaceType: 'campus',
              timeZone: 'America/New_York',
            },
          ],
          events: {},
        }}
        activeModal={{name: null, data: null}}
      />);

      // For this test, whether the utilization data has been loaded or not is not important. So, to
      // make the test faster, skip it.
      component.setState({view: 'VISIBLE'});

      // Ensure that the header uses the right language to describe the 2-space filtered
      // scenario.
      assert.equal(
        component.find('.insights-space-list-summary-header').text(),
        'This 1 space in My Campus has seen 0 visitors during open hours this past week'
      );
    });
    it(`should render phrase properly a whole building is picked`, async function() {
      // Render the component
      const component = mount(<InsightsSpaceList
        spaces={{
          filters: {
            search: '',
            parent: 'spc_3',
          },
          data: [
            {
              id: 'spc_1',
              name: 'My Space',
              currentCount: 2,
              capacity: 5,
              parentId: 'spc_3',
              spaceType: 'space',
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_2',
              name: 'My Space 2',
              currentCount: 2,
              capacity: 5,
              parentId: 'spc_3',
              spaceType: 'space',
              timeZone: 'America/New_York',
            },
            {
              id: 'spc_3',
              name: 'My Building',
              spaceType: 'building',
              timeZone: 'America/New_York',
            },
          ],
          events: {},
        }}
        activeModal={{name: null, data: null}}
      />);

      // For this test, whether the utilization data has been loaded or not is not important. So, to
      // make the test faster, skip it.
      component.setState({view: 'VISIBLE'});

      // Ensure that the header uses the right language to describe the 2-space filtered
      // scenario.
      assert.equal(
        component.find('.insights-space-list-summary-header').text(),
        'Your 2 spaces in My Building have seen 0 visitors during open hours this past week'
      );
    });
  });

  it('should calculate the total number of ingresses for a space', function() {
    // Render the component
    const component = mount(<InsightsSpaceList
      spaces={{
        filters: {search: ''},
        data: [
          {
            id: 'spc_1',
            spaceType: 'space',
            name: 'My Space',
            currentCount: 2,
            capacity: 5,
            timeZone: 'America/New_York',
          },
        ],
        events: {},
      }}
      activeModal={{name: null, data: null}}
    />);

    // Add a couple empty count buckets
    component.setState({
      timeSegment: 'WHOLE_DAY',
      spaceCounts: {
        spc_1: [
          {
            timestamp: '2018-05-08T19:36:48.562Z',
            timestampAsMoment: moment.utc('2018-05-08T19:36:48.562Z'), /* optimization */
            interval: {analytics: {entrances: 0, exits: 0}},
          },
          {
            timestamp: '2018-05-08T19:36:48.562Z',
            timestampAsMoment: moment.utc('2018-05-08T19:36:48.562Z'), /* optimization */
            interval: {analytics: {entrances: 0, exits: 0}},
          },
          {
            timestamp: '2018-05-09T19:36:48.562Z',
            timestampAsMoment: moment.utc('2018-05-09T19:36:48.562Z'), /* optimization */
            interval: {analytics: {entrances: 0, exits: 0}},
          },
        ],
      },
    });

    // And verify that the total number of ingresses is zero
    assert.equal(component.instance().calculateTotalNumberOfIngressesForSpaces(), 0);

    // Add a few ingresses into the data
    component.setState({
      timeSegment: 'WHOLE_DAY',
      spaceCounts: {
        spc_1: [
          {
            timestamp: '2018-05-07T19:36:48.562Z',
            timestampAsMoment: moment.utc('2018-05-08T19:36:48.562Z'), /* optimization */
            interval: {analytics: {entrances: 6, exits: 0}},
          },
          {
            timestamp: '2018-05-08T19:36:48.562Z',
            timestampAsMoment: moment.utc('2018-05-08T19:36:48.562Z'), /* optimization */
            interval: {analytics: {entrances: 0, exits: 0}},
          },
          {
            timestamp: '2018-05-09T19:36:48.562Z',
            timestampAsMoment: moment.utc('2018-05-09T19:36:48.562Z'), /* optimization */
            interval: {analytics: {entrances: 1, exits: 0}},
          },
        ],
      },
    });

    // And verify that the number of ingresses reflected the change in data
    assert.equal(component.instance().calculateTotalNumberOfIngressesForSpaces(), 7);

    // Add a few ingresses into the data
    component.setState({
      timeSegment: 'WORKING_HOURS',
      spaceCounts: {
        spc_1: [
          {
            timestamp: '2018-05-08T00:36:48.562Z', /* NOT DURING WORKING HOURS */
            timestampAsMoment: moment.utc('2018-05-08T00:36:48.562Z'), /* optimization */
            interval: {analytics: {entrances: 6, exits: 0}},
          },
          {
            timestamp: '2018-05-08T12:36:48.562Z', /* DURING WORKING HOURS */
            timestampAsMoment: moment.utc('2018-05-08T12:36:48.562Z'), /* optimization */
            interval: {analytics: {entrances: 3, exits: 0}},
          },
        ],
      },
    });

    // And verify that the number of ingresses reflected the change in data
    assert.equal(component.instance().calculateTotalNumberOfIngressesForSpaces(), 3);
  });
});
