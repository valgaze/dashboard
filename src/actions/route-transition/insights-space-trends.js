import { core } from '../../client';

import collectionSpacesSet from '../collection/spaces/set';
import collectionSpacesError from '../collection/spaces/error';
import collectionTimeSegmentGroupsSet from '../collection/time-segment-groups/set';
import collectionTimeSegmentGroupsError from '../collection/time-segment-groups/error';
import collectionSpacesSetDefaultTimeRange from '../collection/spaces/set-default-time-range';

export const ROUTE_TRANSITION_INSIGHTS_SPACE_TRENDS = 'ROUTE_TRANSITION_INSIGHTS_SPACE_TRENDS';

export default function routeTransitionInsightsSpaceTrends(id) {
  return async dispatch => {
    dispatch({ type: ROUTE_TRANSITION_INSIGHTS_SPACE_TRENDS, id });

    // Ideally, we'd load a single space (since the view only pertains to one space). But, we need
    // every space to traverse through the space hierarchy and render a list of parent spaces on
    // this view unrfortunately.
    try {
      const spaces = await core.spaces.list();
      const selectedSpace = spaces.results.find(s => s.id === id);
      dispatch(collectionSpacesSetDefaultTimeRange(selectedSpace));
      dispatch(collectionSpacesSet(spaces.results));
    } catch (err) {
      dispatch(collectionSpacesError(`Error loading space: ${err.message}`));
    }

    // Load a list of all time segment groups, which is required in order to render in the time
    // segment list.
    try {
      const timeSegmentGroups = await core.time_segment_groups.list();
      dispatch(collectionTimeSegmentGroupsSet(timeSegmentGroups.results));
    } catch (err) {
      dispatch(collectionTimeSegmentGroupsError(`Error loading time segments: ${err.message}`));
    }
  }
}
