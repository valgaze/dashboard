import { core } from '../../client';

import collectionSpacesSet from '../collection/spaces/set';
import collectionSpacesError from '../collection/spaces/error';
import collectionTimeSegmentGroupsSet from '../collection/time-segment-groups/set';
import collectionTimeSegmentGroupsError from '../collection/time-segment-groups/error';

import errorHelper from '../../helpers/error-helper/index';

export const ROUTE_TRANSITION_INSIGHTS_SPACE_LIST = 'ROUTE_TRANSITION_INSIGHTS_SPACE_LIST';

export default function routeTransitionInsightsSpaceList() {
  return async dispatch => {
    dispatch({ type: ROUTE_TRANSITION_INSIGHTS_SPACE_LIST });

    // Load a list of all spaces
    const spaces = errorHelper({
      try: () => core.spaces.list(),
      catch: error => {
        dispatch(collectionSpacesError(`Error loading spaces: ${error}`));
      },
      else: async request => {
        const spaces = await request;
        dispatch(collectionSpacesSet(spaces.results));
      },
    });

    const timeSegmentGroups = errorHelper({
      try: () => core.time_segment_groups.list(),
      catch: error => {
        dispatch(collectionTimeSegmentGroupsError(`Error loading time segments: ${error}`));
      },
      else: async request => {
        const timeSegmentGroups = await request;
        dispatch(collectionTimeSegmentGroupsSet(timeSegmentGroups.results));
      },
    });

    return Promise.all([spaces, timeSegmentGroups]);
  };
}
