import { core } from '../../client';

import collectionSpacesSet from '../collection/spaces/set';
import collectionSpacesError from '../collection/spaces/error';
import collectionTimeSegmentGroupsSet from '../collection/time-segment-groups/set';
import collectionTimeSegmentGroupsError from '../collection/time-segment-groups/error';
import collectionSpacesSetDefaultTimeRange from '../collection/spaces/set-default-time-range';

import errorHelper from '../../helpers/error-helper/index';

export const ROUTE_TRANSITION_INSIGHTS_SPACE_TRENDS = 'ROUTE_TRANSITION_INSIGHTS_SPACE_TRENDS';

export default function routeTransitionInsightsSpaceTrends(id) {
  return async dispatch => {
    dispatch({ type: ROUTE_TRANSITION_INSIGHTS_SPACE_TRENDS, id });

    // Ideally, we'd load a single space (since the view only pertains to one space). But, we need
    // every space to traverse through the space hierarchy and render a list of parent spaces on
    // this view unrfortunately.
    const spaces = errorHelper({
      try: () => core.spaces.list(),
      catch: err => {
        dispatch(collectionSpacesError(`Error loading space: ${err.message}`));
      },
      else: async request => {
        const spaces = await request;
        const selectedSpace = spaces.results.find(s => s.id === id);
        dispatch(collectionSpacesSetDefaultTimeRange(selectedSpace));
        dispatch(collectionSpacesSet(spaces.results));
      },
    });

    // Load a list of all time segment groups, which is required in order to render in the time
    // segment list.
    const timeSegmentGroups = errorHelper({
      try: () => core.time_segment_groups.list(),
      catch: err => {
        dispatch(collectionTimeSegmentGroupsError(`Error loading time segments: ${err.message}`));
      },
      else: async request => {
        const timeSegmentGroups = await request;
        dispatch(collectionTimeSegmentGroupsSet(timeSegmentGroups.results));
      },
    });

    return Promise.all([spaces, timeSegmentGroups]);
  }
}
