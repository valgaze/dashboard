import { core } from '../../client';

import collectionSpacesSet from '../collection/spaces/set';
import collectionSpacesError from '../collection/spaces/error';
import collectionTimeSegmentGroupsSet from '../collection/time-segment-groups/set';

export const ROUTE_TRANSITION_INSIGHTS_SPACE_LIST = 'ROUTE_TRANSITION_INSIGHTS_SPACE_LIST';

export default function routeTransitionInsightsSpaceList() {
  return async dispatch => {
    dispatch({ type: ROUTE_TRANSITION_INSIGHTS_SPACE_LIST });

    try {
      const spaces = await core.spaces.list();
      dispatch(collectionSpacesSet(spaces.results));

      // const timeSegmentGroups = await core.time_segment_groups.list();
      // dispatch(collectionTimeSegmentGroupsSet(timeSegmentGroups.results));
      dispatch(collectionTimeSegmentGroupsSet([
        {
            "id": "tsg_575378014376820745",
            "name": "Lunch Group",
            "time_segments": [
                {
                    "time_segment_id": "tsm_575377905756930055",
                    "name": "Lunchtime"
                },
                {
                    "time_segment_id": "tsm_575377670754271236",
                    "name": "New Time Segment Name"
                }
            ]
        },
        {
            "id": "tsg_575377720670683141",
            "name": "New Time Seg Group 2",
            "time_segments": [
                {
                    "time_segment_id": "tsm_575377670754271236",
                    "name": "New Time Segment Name"
                }
            ]
        }
      ]));
    } catch (err) {
      dispatch(collectionSpacesError(err));
    }
  };
}
