import React from 'react';
import { mount, shallow } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';
import moment from 'moment';

import { ExploreSpaceList } from './index';

import { DEFAULT_TIME_SEGMENT_GROUP } from '../../helpers/time-segments/index';

function timeout(delay) {
  return new Promise(r => setTimeout(r, delay));
}

const timeSegmentGroups = {
  data: [
    {
      "id": "tsg_575378014376820745",
      "name": "Lunch Group",
      "timeSegments": [
        {
          "timeSegmentId": "tsm_575377905756930055",
          "name": "Lunchtime"
        },
        {
          "timeSegmentId": "tsm_575377670754271236",
          "name": "New Time Segment Name"
        }
      ]
    },
    {
      "id": "tsg_575377720670683141",
      "name": "New Time Seg Group 2",
      "timeSegments": [
        {
          "timeSegmentId": "tsm_575377670754271236",
          "name": "New Time Segment Name"
        }
      ]
    },
  ],
};

describe('explore space list', function() {
  it('should render explore list space list (smoke test)', async function() {
    // Render the component
    const component = mount(<ExploreSpaceList
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
      timeSegmentGroups={timeSegmentGroups}
      calculatedData={{
        state: 'COMPLETE',
        data: {
          spaceUtilizations: {
            'spc_1': 0.5,
          },
          spaceCounts: {
            'spc_1': [],
          },
        },
      }}
    />);

    // Ensure that a single space was rendered
    assert.equal(component.find('.explore-space-list-item.body-row').length, 1);

    // Fetch the first space rendered. Ensure that it's found.
    const firstSpace = component.find('.explore-space-list-item.body-row').first();
    assert(firstSpace);

    // Verify the space's name was rendered
    assert.equal(firstSpace.find('.explore-space-list-item-name').text(), 'My Space');

    // Verify the capacity was rendered.
    assert.equal(firstSpace.find('.explore-space-list-item-capacity').text(), '5');

    // Verify the utilization was rendered
    assert.equal(
      component
      .find('.explore-space-list-item.body-row')
      .first()
      .find('PercentageBar')
      .props().percentage,
      0.5
    );
  });
  it(`should render a set capacity link if the space doesn't have a capacity set`, async function() {
    // Render the component
    const component = mount(<ExploreSpaceList
      spaces={{
        filters: {search: ''},
        data: [
          {
            id: 'spc_1',
            spaceType: 'space',
            name: 'My Space',
            currentCount: 2,
            capacity: null, /* XXX: NO CAPACITY */
            timeZone: 'America/New_York',
          },
        ],
        events: {},
      }}
      activeModal={{name: null, data: null}}
      timeSegmentGroups={timeSegmentGroups}
      calculatedData={{
        state: 'COMPLETE',
        data: {
          spaceUtilizations: {
            'spc_1': 0.5,
          },
          spaceCounts: {
            'spc_1': [],
          },
        },
      }}
    />);

    // Ensure that a single space was rendered
    assert.equal(component.find('.explore-space-list-item.body-row').length, 1);

    // Verify set capacity link was rendered
    const firstSpace = component.find('.explore-space-list-item.body-row').first();
    assert.equal(firstSpace.find('.explore-space-list-item-capacity').text(), 'Set');
  });
  it(`should show an error in the error bar when something bad happens in fetchData`, async function() {
    // Render the component
    const component = mount(<ExploreSpaceList
      spaces={{
        filters: {search: ''},
        data: [
          {
            id: 'spc_1',
            spaceType: 'space',
            name: 'My Space',
            currentCount: 2,
            capacity: null, /* XXX: NO CAPACITY */
            timeZone: 'America/New_York',
          },
        ],
        events: {},
      }}
      activeModal={{name: null, data: null}}
      timeSegmentGroups={timeSegmentGroups}
      calculatedData={{
        state: 'ERROR',
        data: {
          spaceCounts: {},
          spaceUtilizations: {},
        },
        error: 'Error message here',
      }}
    />);

    // Ensure that a single space was rendered
    assert.equal(component.find('ErrorBar').props().message, 'Error message here');
  });
  it('should disable filters when the space explore card is loading', async function() {
    // Render the component
    const component = mount(<ExploreSpaceList
      spaces={{
        filters: {search: ''},
        data: [
          {
            id: 'spc_1',
            spaceType: 'space',
            name: 'My Space',
            currentCount: 2,
            capacity: null, /* XXX: NO CAPACITY */
            timeZone: 'America/New_York',
          },
        ],
        events: {},
      }}
      activeModal={{name: null, data: null}}
      timeSegmentGroups={timeSegmentGroups}
      calculatedData={{
        state: 'LOADING',
        data: {
          spaceCounts: {},
          spaceUtilizations: {},
        },
        error: 'Error message here',
      }}
    />);

    // Make sure filter selectors are disabled - we don't want people changing the filters while
    // loading!
    assert.equal(
      component.find('.explore-space-list-time-segment-selector InputBox').props().disabled,
      true,
    );
    assert.equal(
      component.find('.explore-space-list-duration-selector InputBox').props().disabled,
      true,
    );
  });

  describe('sorting of spaces', function() {
    it(`should by default sort spaces in order of name decending`, async function() {
      // Render the component
      const component = shallow(<ExploreSpaceList
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
        timeSegmentGroups={timeSegmentGroups}

        calculatedData={{
          state: 'COMPLETE',
          data: {
            spaceUtilizations: {
              'spc_1': 0.5,
              'spc_2': 0.5,
              'spc_3': 0.5,
            },
            spaceCounts: {
              'spc_1': [],
              'spc_2': [],
              'spc_3': [],
            },
          },
        }}
      />);

      // Ensure that two spaces were rendered
      assert.equal(component.find('.explore-space-list-item.body-row').length, 3);

      // By default, the spaces should be sorted decending - starting with `aa` and ending with `zz`
      const spaces = component.find('.explore-space-list-item.body-row');
      assert.equal(spaces.at(0).find('.explore-space-list-item-name').text(), 'aa My Space');
      assert.equal(spaces.at(1).find('.explore-space-list-item-name').text(), 'mm My Space');
      assert.equal(spaces.at(2).find('.explore-space-list-item-name').text(), 'zz My Space');
    });
    it(`should be able to invert space order by name by clicking on the header in the space list`, async function() {
      // Render the component
      const component = mount(<ExploreSpaceList
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
        timeSegmentGroups={timeSegmentGroups}

        calculatedData={{
          state: 'COMPLETE',
          data: {
            spaceUtilizations: {
              'spc_1': 0.5,
              'spc_2': 0.5,
              'spc_3': 0.5,
            },
            spaceCounts: {
              'spc_1': [],
              'spc_2': [],
              'spc_3': [],
            },
          },
        }}
      />);

      // Ensure that three spaces were rendered
      assert.equal(component.find('.explore-space-list-item.body-row').length, 3);

      // Click the header for the space column
      component
        .find('.sortable-grid-header-item').first()
        .find('.sortable-grid-header-item-label').simulate('click');

      // Now, the sort order should be reversed, starting at `zz` at top and going to `aa` at bottom
      const spaces = component.find('.explore-space-list-item.body-row');
      assert.equal(spaces.at(0).find('.explore-space-list-item-name').text(), 'zz My Space');
      assert.equal(spaces.at(1).find('.explore-space-list-item-name').text(), 'mm My Space');
      assert.equal(spaces.at(2).find('.explore-space-list-item-name').text(), 'aa My Space');
    });
    it(`should be able to sort by capacity ascending if the capacity header is clicked, and switch to decending if the header is clicked again`, async function() {
      // Render the component
      const component = mount(<ExploreSpaceList
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
        timeSegmentGroups={timeSegmentGroups}

        calculatedData={{
          state: 'COMPLETE',
          data: {
            spaceUtilizations: {
              'spc_1': 0.5,
              'spc_2': 0.5,
              'spc_3': 0.5,
              'spc_4': 0.5,
            },
            spaceCounts: {
              'spc_1': [],
              'spc_2': [],
              'spc_3': [],
              'spc_4': [],
            },
          },
        }}
      />);

      // Ensure that three spaces were rendered
      assert.equal(component.find('.explore-space-list-item.body-row').length, 4);

      // Click the header for the space column
      component
        .find('.sortable-grid-header-item').at(1) /* Capacity */
        .find('.sortable-grid-header-item-label').simulate('click');

      // The spaces should be sorted such that the one that has the largest capacity is first (mm)
      // and then the smaller capacities (aa then zz). Finally, rr should be at the end since it
      // doesn't have a capacity.
      const spaces = component.find('.explore-space-list-item.body-row');
      assert.equal(spaces.at(0).find('.explore-space-list-item-name').text(), 'mm My Space');
      assert.equal(spaces.at(1).find('.explore-space-list-item-name').text(), 'aa My Space');
      assert.equal(spaces.at(2).find('.explore-space-list-item-name').text(), 'zz My Space');
      assert.equal(spaces.at(3).find('.explore-space-list-item-name').text(), 'rr My Space');

      // Click the header for the space column again, inverting the sort order.
      component
        .find('.sortable-grid-header-item').at(1) /* Capacity */
        .find('.sortable-grid-header-item-label').simulate('click');

      // The spaces should be sorted such that the one without a capacity is first, then the one
      // that has the smallest capacity (zz), and then the larger capacities (aa then mm).
      const spacesInverse = component.find('.explore-space-list-item.body-row');
      assert.equal(spacesInverse.at(0).find('.explore-space-list-item-name').text(), 'rr My Space');
      assert.equal(spacesInverse.at(1).find('.explore-space-list-item-name').text(), 'zz My Space');
      assert.equal(spacesInverse.at(2).find('.explore-space-list-item-name').text(), 'aa My Space');
      assert.equal(spacesInverse.at(3).find('.explore-space-list-item-name').text(), 'mm My Space');
    });
    it(`should be able to sort by utilization ascending if the utilization header is clicked, and switch to decending if the header is clicked again`, async function() {
      // Render the component
      const component = mount(<ExploreSpaceList
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
        timeSegmentGroups={timeSegmentGroups}

        calculatedData={{
          state: 'COMPLETE',
          data: {
            spaceUtilizations: {
              spc_2: 0.1, /* mm My Space */
              spc_3: 0.2, /* zz My Space */
              spc_1: 0.8, /* aa My Space */
              spc_4: undefined, /* rr My Space */
            },
            spaceCounts: {
              'spc_1': [],
              'spc_2': [],
              'spc_3': [],
              'spc_4': [],
            },
          },
        }}
      />);

      // Set capacities to known values. This is important to make sure the sorting order tests work
      // (and to make it easy to validate if they work)
      component.setState({
      });

      // Ensure that three spaces were rendered
      assert.equal(component.find('.explore-space-list-item.body-row').length, 4);

      // Click the header for the space column
      component
        .find('.sortable-grid-header-item').at(2) /* Utilization */
        .find('.sortable-grid-header-item-label').simulate('click');

      // The spaces should be sorted such that the one that has the largest utilization is first, 
      // the smallest utilization is in the middle, and any spaces without a capacity are last.
      const spaces = component.find('.explore-space-list-item.body-row');
      assert.equal(spaces.at(0).find('.explore-space-list-item-name').text(), 'My Space 1')
      assert.equal(spaces.at(1).find('.explore-space-list-item-name').text(), 'My Space 3');
      assert.equal(spaces.at(2).find('.explore-space-list-item-name').text(), 'My Space 2');
      assert.equal(spaces.at(3).find('.explore-space-list-item-name').text(), 'My Space 4');

      // Click the header for the space column again, inverting the sort order.
      component
        .find('.sortable-grid-header-item').at(2) /* Utilization */
        .find('.sortable-grid-header-item-label').simulate('click');

      // The spaces should be sorted such that the one that has the  utilization is first, 
      // the smallest utilization is in the middle, and any spaces without a capacity are last.
      const spacesInverse = component.find('.explore-space-list-item.body-row');
      assert.equal(spacesInverse.at(0).find('.explore-space-list-item-name').text(), 'My Space 4');
      assert.equal(spacesInverse.at(1).find('.explore-space-list-item-name').text(), 'My Space 2');
      assert.equal(spacesInverse.at(2).find('.explore-space-list-item-name').text(), 'My Space 3');
      assert.equal(spacesInverse.at(3).find('.explore-space-list-item-name').text(), 'My Space 1');
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
      const component = mount(<ExploreSpaceList
        spaces={{
          filters: {search: ''},
          data: [SPACE],
          events: {},
        }}
        timeSegmentGroups={timeSegmentGroups}
        activeModal={{name: null, data: null}}
        onOpenModal={onOpenModal}
        onSetCapacity={onSetCapacity}

        calculatedData={{
          state: 'COMPLETE',
          data: {
            spaceUtilizations: {
              'spc_1': 0.5,
            },
            spaceCounts: {
              'spc_1': [],
            },
          },
        }}
      />);

      // Ensure that a single space was rendered
      assert.equal(component.find('.explore-space-list-item.body-row').length, 1);

      // Click on the 'set capacity' link
      const stopPropagation = sinon.spy();
      component
        .find('.explore-space-list-item-capacity-set-link')
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
      component.find('ExploreSetCapacityModal').props().onSubmit();
    });
  });

  describe('rendering phrases correctly', function() {
    it(`should render phrase properly when a number of unfiltered spaces are shown`, async function() {
      // Render the component
      const component = mount(<ExploreSpaceList
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
              timeSegmentGroups: [],
              timeSegments: [],
            },
            {
              id: 'spc_2',
              spaceType: 'space',
              name: 'My Space 2',
              currentCount: 2,
              capacity: 5,
              timeZone: 'America/New_York',
              timeSegmentGroups: [],
              timeSegments: [],
            },
          ],
          events: {},
        }}
        activeModal={{name: null, data: null}}
        timeSegmentGroups={timeSegmentGroups}

        calculatedData={{
          state: 'COMPLETE',
          data: {
            spaceUtilizations: {
              'spc_1': 0.5,
            },
            spaceCounts: {
              'spc_1': [],
              'spc_2': [],
            },
          },
        }}
      />);

      // Load in some fake count data
      component.setState({
        view: 'VISIBLE',
        spaceCounts: {
          spc_1: [],
          spc_2: [],
          spc_3: [],
        },
      });

      // Ensure that the header uses the right language to describe the 2-space unfiltered
      // scenario.
      assert.equal(
        component.find('.explore-space-list-summary-header').first().text(),
        `Your 2 spaces have seen 0 visitors during ${DEFAULT_TIME_SEGMENT_GROUP.name} this past week`
      );
    });
    it(`should render phrase properly when a simgle unfiltered space is shown`, async function() {
      // Render the component
      const component = mount(<ExploreSpaceList
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
        timeSegmentGroups={timeSegmentGroups}

        calculatedData={{
          state: 'COMPLETE',
          data: {
            spaceUtilizations: {
              'spc_1': 0.5,
            },
            spaceCounts: {
              'spc_1': [],
            },
          },
        }}
      />);

      // Load in some fake count data
      component.setState({
        view: 'VISIBLE',
        spaceCounts: {
          spc_1: [],
          spc_2: [],
          spc_3: [],
        },
      });

      // Ensure that the header uses the right language to describe the 1-space unfiltered
      // scenario.
      assert.equal(
        component.find('.explore-space-list-summary-header').first().text(),
        `Your 1 space has seen 0 visitors during ${DEFAULT_TIME_SEGMENT_GROUP.name} this past week`
      );
    });
    it(`should render phrase properly when two filtered spaces are shown`, async function() {
      // Render the component
      const component = mount(<ExploreSpaceList
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
        timeSegmentGroups={timeSegmentGroups}

        calculatedData={{
          state: 'COMPLETE',
          data: {
            spaceUtilizations: {
              'spc_1': 0.5,
              'spc_2': 0.5,
            },
            spaceCounts: {
              'spc_1': [],
              'spc_2': [],
            },
          },
        }}
      />);

      // Load in some fake count data
      component.setState({
        view: 'VISIBLE',
        spaceCounts: {
          spc_1: [],
          spc_2: [],
          spc_3: [],
        },
      });

      // Ensure that the header uses the right language to describe the 2-space filtered
      // scenario.
      assert.equal(
        component.find('.explore-space-list-summary-header').first().text(),
        `These 2 spaces have seen 0 visitors during ${DEFAULT_TIME_SEGMENT_GROUP.name} this past week`
      );
    });
    it(`should render phrase properly when a single filtered space is shown`, async function() {
      // Render the component
      const component = mount(<ExploreSpaceList
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
        timeSegmentGroups={timeSegmentGroups}

        calculatedData={{
          state: 'COMPLETE',
          data: {
            spaceUtilizations: {
              'spc_1': 0.5,
            },
            spaceCounts: {
              'spc_1': [],
            },
          },
        }}
      />);

      // Load in some fake count data
      component.setState({
        view: 'VISIBLE',
        spaceCounts: {
          spc_1: [],
          spc_2: [],
          spc_3: [],
        },
      });

      // Ensure that the header uses the right language to describe the 1-space filtered
      // scenario.
      assert.equal(
        component.find('.explore-space-list-summary-header').first().text(),
        `This 1 space has seen 0 visitors during ${DEFAULT_TIME_SEGMENT_GROUP.name} this past week`
      );
    });
    it(`should render phrase properly when two filtered spaces are shown and a floor is picked`, async function() {
      // Render the component
      const component = mount(<ExploreSpaceList
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
        timeSegmentGroups={timeSegmentGroups}

        calculatedData={{
          state: 'COMPLETE',
          data: {
            spaceUtilizations: {
              'spc_1': 0.5,
              'spc_2': 0.5,
              'spc_3': 0.5,
            },
            spaceCounts: {
              'spc_1': [],
              'spc_2': [],
              'spc_3': [],
            },
          },
        }}
      />);

      // Load in some fake count data
      component.setState({
        view: 'VISIBLE',
        spaceCounts: {
          spc_1: [],
          spc_2: [],
          spc_3: [],
        },
      });

      // Ensure that the header uses the right language to describe the 2-space filtered
      // scenario.
      assert.equal(
        component.find('.explore-space-list-summary-header').first().text(),
        `These 2 spaces on My Floor have seen 0 visitors during ${DEFAULT_TIME_SEGMENT_GROUP.name} this past week`
      );
    });
    it(`should render phrase properly when two filtered spaces are shown and a building is picked`, async function() {
      // Render the component
      const component = mount(<ExploreSpaceList
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
        timeSegmentGroups={timeSegmentGroups}

        calculatedData={{
          state: 'COMPLETE',
          data: {
            spaceUtilizations: {
              'spc_1': 0.5,
              'spc_2': 0.5,
              'spc_3': 0.5,
            },
            spaceCounts: {
              'spc_1': [],
              'spc_2': [],
              'spc_3': [],
            },
          },
        }}
      />);

      // Load in some fake count data
      component.setState({
        view: 'VISIBLE',
        spaceCounts: {
          spc_1: [],
          spc_2: [],
          spc_3: [],
        },
      });

      // Ensure that the header uses the right language to describe the 2-space filtered
      // scenario.
      assert.equal(
        component.find('.explore-space-list-summary-header').first().text(),
        `These 2 spaces in My Building have seen 0 visitors during ${DEFAULT_TIME_SEGMENT_GROUP.name} this past week`
      );
    });
    it(`should render phrase properly when a single filtered space is shown and a campus is picked`, async function() {
      // Render the component
      const component = mount(<ExploreSpaceList
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
        timeSegmentGroups={timeSegmentGroups}

        calculatedData={{
          state: 'COMPLETE',
          data: {
            spaceUtilizations: {
              'spc_1': 0.5,
              'spc_2': 0.5,
              'spc_3': 0.5,
            },
            spaceCounts: {
              'spc_1': [],
              'spc_2': [],
              'spc_3': [],
            },
          },
        }}
      />);

      // Load in some fake count data
      component.setState({
        view: 'VISIBLE',
        spaceCounts: {
          spc_1: [],
          spc_2: [],
          spc_3: [],
        },
      });

      // Ensure that the header uses the right language to describe the 2-space filtered
      // scenario.
      assert.equal(
        component.find('.explore-space-list-summary-header').first().text(),
        `This 1 space in My Campus has seen 0 visitors during ${DEFAULT_TIME_SEGMENT_GROUP.name} this past week`
      );
    });
    it(`should render phrase properly a whole building is picked`, async function() {
      // Render the component
      const component = mount(<ExploreSpaceList
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
        timeSegmentGroups={timeSegmentGroups}

        calculatedData={{
          state: 'COMPLETE',
          data: {
            spaceUtilizations: {
              'spc_1': 0.5,
              'spc_2': 0.5,
              'spc_3': 0.5,
            },
            spaceCounts: {
              'spc_1': [],
              'spc_2': [],
              'spc_3': [],
            },
          },
        }}
      />);

      // Load in some fake count data
      component.setState({
        view: 'VISIBLE',
        spaceCounts: {
          spc_1: [],
          spc_2: [],
          spc_3: [],
        },
      });

      // Ensure that the header uses the right language to describe the 2-space filtered
      // scenario.
      assert.equal(
        component.find('.explore-space-list-summary-header').first().text(),
        `Your 2 spaces in My Building have seen 0 visitors during ${DEFAULT_TIME_SEGMENT_GROUP.name} this past week`
      );
    });
  });

  it('should calculate the total number of ingresses for a space', function() {
    // Render the component
    const component = mount(<ExploreSpaceList
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
      timeSegmentGroups={timeSegmentGroups}

      /* Add a couple empty count buckets */
      calculatedData={{
        spaceCounts: {
        },
      }}
      /* Add a couple empty count buckets */
      calculatedData={{
        state: 'COMPLETE',
        data: {
          spaceUtilizations: {
            'spc_1': 0.5,
          },
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
        },
      }}
    />);

    // Verify that the total number of ingresses is zero
    assert.equal(component.instance().calculateTotalNumberOfIngressesForSpaces(), 0);

    // Render the component, with more ingresses
    const component2 = mount(<ExploreSpaceList
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
      timeSegmentGroups={timeSegmentGroups}

      /* Add a couple empty count buckets */
      calculatedData={{
        state: 'COMPLETE',
        data: {
          spaceUtilizations: {
            'spc_1': 0.5,
          },
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
        },
      }}
    />);
    // And verify that the number of ingresses reflected the change in data
    assert.equal(component2.instance().calculateTotalNumberOfIngressesForSpaces(), 7);
  });
});
