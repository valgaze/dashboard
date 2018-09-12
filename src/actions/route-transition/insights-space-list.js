import { core } from '../../client';

import collectionSpacesSet from '../collection/spaces/set';
import collectionSpacesError from '../collection/spaces/error';
import collectionTimeSegmentGroupsSet from '../collection/time-segment-groups/set';
import collectionTimeSegmentGroupsError from '../collection/time-segment-groups/error';

export const ROUTE_TRANSITION_INSIGHTS_SPACE_LIST = 'ROUTE_TRANSITION_INSIGHTS_SPACE_LIST';

export default function routeTransitionInsightsSpaceList() {
  return async dispatch => {
    dispatch({ type: ROUTE_TRANSITION_INSIGHTS_SPACE_LIST });

    // Load a list of all spaces
    try {
      const spaces = await core.spaces.list();
      dispatch(collectionSpacesSet(spaces.results));
    } catch (err) {
      dispatch(collectionSpacesError(`Error loading space: ${err}`));
    }

    // Load a list of all time segment groups, which is required in order to render in the time
    // segment list.
    try {
      const timeSegmentGroups = await core.time_segment_groups.list();
      dispatch(collectionTimeSegmentGroupsSet(timeSegmentGroups.results));
    } catch (err) {
      dispatch(collectionTimeSegmentGroupsError(`Error loading time segments: ${err}`));
    }
  };
}
