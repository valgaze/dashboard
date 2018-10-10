import { core } from '../../client';
import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';

import collectionSpacesSet from '../collection/spaces/set';
import collectionSpacesError from '../collection/spaces/error';
import collectionSpacesSetEvents from '../collection/spaces/set-events';
import collectionDoorwaysSet from '../collection/doorways/set';
import collectionDoorwaysError from '../collection/doorways/error';
import collectionLinksSet from '../collection/links/set';
import collectionLinksError from '../collection/links/error';
import errorHelper from '../../helpers/error-helper/index';

import {
  getCurrentLocalTimeAtSpace,
  formatInISOTime,
} from '../../helpers/space-time-utilities/index';

export const ROUTE_TRANSITION_LIVE_SPACE_LIST = 'ROUTE_TRANSITION_LIVE_SPACE_LIST';

export default function routeTransitionLiveSpaceList() {
  return async dispatch => {
    dispatch({ type: ROUTE_TRANSITION_LIVE_SPACE_LIST });

    const spaces = await errorHelper({
      try: () => core.spaces.list(),
      catch: error => {
        dispatch(collectionSpacesError(error));
      },
      else: async request => {
        const spaces = await request;
        dispatch(collectionSpacesSet(spaces.results));
      },
    });
    if (typeof spaces === 'undefined') { return; }

    const doorways = await errorHelper({
      try: () => core.doorways.list({environment: true}),
      catch: error => {
        dispatch(collectionDoorwaysError(error));
      },
      else: async request => {
        const doorways = await request;
        dispatch(collectionDoorwaysSet(doorways.results));
      },
    });
    if (typeof doorways === 'undefined') { return; }

    const links = await errorHelper({
      try: () => core.links.list(),
      catch: error => {
        dispatch(collectionLinksError(error));
      },
      else: async request => {
        const links = await request;
        dispatch(collectionLinksSet(links.results));
      },
    });
    if (typeof links === 'undefined') { return; }

    // Then, fetch all initial events for each space.
    // This is used to populate each space's events collection with all the events from the last
    // minute so that the real time event charts all display as "full" when the page reloads.
    const initialEvents = Promise.all(spaces.results.map((s, ct) => {
      const space = objectSnakeToCamel(s);
      return errorHelper({
        try: () => core.spaces.events({
          id: space.id,
          start_time: formatInISOTime(getCurrentLocalTimeAtSpace(space).subtract(1, 'minute')),
          end_time: formatInISOTime(getCurrentLocalTimeAtSpace(space)),
        }),
        catch: error => {
          dispatch(collectionSpacesError(error));
        },
        else: async request => {
          const spaceEventSet = await request;
          dispatch(collectionSpacesSetEvents(s, spaceEventSet.results.map(i => ({
            countChange: i.direction,
            timestamp: i.timestamp
          }))));
        },
      });
    }));

    return Promise.all([spaces, doorways, links, initialEvents]);
  };
}
