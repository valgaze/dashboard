import React from 'react';

import uuid from 'uuid';
import { core } from '../../client';
import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';
import spacesPush from '../collection/spaces/push';
import collectionDashboardsCalculateReportData from '../collection/dashboards/calculate-report-data';

import exploreDataCalculateDataLoading from '../explore-data/calculate-data-loading';
import exploreDataCalculateDataComplete from '../explore-data/calculate-data-complete';

export const ROUTE_TRANSITION_EXPLORE_NEW_DETAIL = 'ROUTE_TRANSITION_EXPLORE_NEW';

// const TIME_SEGMENT_GROUP_ID = 'tsg_581948608237010959';
const TIME_SEGMENT_GROUP_ID = 'tsg_575401441519206683'; // demo

const QUESTIONS = [
  {
    id: 'qst_1',
    name: 'How many people came to lunch?',
    filters: {
      spaces: space => space.description.indexOf('cafeteria') !== -1, /* TODO: some sort of space usage type? */
    },
    controls: {
      timeSegmentGroup: {
        id: 'qct_2',
        label: 'Time Segment Group',
        render: (data, onChange) => (
          <span onClick={() => onChange('new data')}>selectbox here, data is {data}</span>
        ),
      },
    },
    reports: spaces => [
      {
        id: uuid.v4(), // FIXME: bad idea!
        name: 'Cafeteria entrances',
        type: 'TOTAL_VISITS_MULTI_SPACE',
        settings: {
          spaceIds: spaces.map(s => s.id),
          timeRange: 'LAST_WEEK',
          mode: 'MOST_VISITED',
          timeSegmentGroupId: TIME_SEGMENT_GROUP_ID,
        },
      },
      {
        id: uuid.v4(), // FIXME: bad idea!
        name: 'Utilization',
        type: 'UTILIZATION',
        settings: {
          spaceIds: spaces.map(s => s.id),
          timeRange: 'LAST_WEEK',
          mode: 'MOST_UTILIZED',
          timeSegmentGroupId: TIME_SEGMENT_GROUP_ID,
        },
      },
    ],
  },
];

export default function routeTransitionExploreNewDetail(ids, questionId) {
  return async (dispatch, getState) => {
    const question = QUESTIONS.find(question => question.id === questionId) || null;
    dispatch({ type: ROUTE_TRANSITION_EXPLORE_NEW_DETAIL, ids, question });

    dispatch(exploreDataCalculateDataLoading('reports'));

    // Fetch the data for all spaces that have been specified.
    const spaces = await Promise.all(
      ids.map(async id => {
        const space = getState().spaces.data.find(i => i.id === id);
        if (space) {
          return space;
        } else {
          // Space was not found, fetch its data and add it to the collection.
          const newSpace = objectSnakeToCamel(await core.spaces.get({id}));
          dispatch(spacesPush(newSpace));
          return newSpace;
        }
      })
    );

    const reports = contextuallyPickReports(spaces, QUESTIONS.find(q => q.id === questionId));
    await dispatch(collectionDashboardsCalculateReportData(reports));
    dispatch(exploreDataCalculateDataComplete('reports', reports));
  };
}


function contextuallyPickReports(selectedSpaces, question) {
  if (selectedSpaces.length === 0) {
    // No spaces, prompt the user to select at least one
    return [];
  } else if (question) {
    // A question is selected, return the data for that question
    return question.reports(selectedSpaces);
  } else if (selectedSpaces.length === 1) {
    // Single space, show reports that are relevant to one space
    const space = selectedSpaces[0];
    return [
      {
        id: uuid.v4(), // FIXME: bad idea!
        name: 'Total visits',
        type: 'TOTAL_VISITS_ONE_SPACE',
        settings: {
          spaceId: space.id,
          timeRange: 'LAST_WEEK',
          timeSegmentGroups: [
            {
              id: TIME_SEGMENT_GROUP_ID,
              color: 'BLUE',
            },
          ],
        },
      },
      {
        id: uuid.v4(), // FIXME: bad idea!
        name: 'Next week forecast',
        type: 'NEXT_WEEK',
        settings: {
          spaceId: space.id,
          period: 'NEXT_WEEK',
          timeSegmentGroupId: TIME_SEGMENT_GROUP_ID,
        },
      },
      {
        id: uuid.v4(), // FIXME: bad idea!
        name: 'Average time segment breakdown',
        type: 'TS_BREAKDOWN',
        settings: {
          spaceId: space.id,
          timeRange: 'LAST_WEEK',
          color: 'BLUE',
          timeSegmentGroupId: TIME_SEGMENT_GROUP_ID,
        },
      },
    ];
  } else {
    // Multiple spaces, show reports relevant to multiple spaces
    return [
      {
        id: uuid.v4(), // FIXME: bad idea!
        name: 'Total visits',
        type: 'TOTAL_VISITS_MULTI_SPACE',
        settings: {
          spaceIds: selectedSpaces.map(s => s.id),
          timeRange: 'LAST_WEEK',
          mode: 'MOST_VISITED',
          timeSegmentGroupId: TIME_SEGMENT_GROUP_ID,
        },
      },
      {
        id: uuid.v4(), // FIXME: bad idea!
        name: 'Utilization',
        type: 'UTILIZATION',
        settings: {
          spaceIds: selectedSpaces.map(s => s.id),
          timeRange: 'LAST_WEEK',
          mode: 'MOST_UTILIZED',
          timeSegmentGroupId: TIME_SEGMENT_GROUP_ID,
        },
      },
    ];
  }
}
