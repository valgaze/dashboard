import { core } from '../../client';

import collectionSpacesSet from '../collection/spaces/set';
import collectionSpacesError from '../collection/spaces/error';
import collectionDoorwaysSet from '../collection/doorways/set';
import collectionDoorwaysError from '../collection/doorways/error';
import collectionLinksSet from '../collection/links/set';
import collectionLinksError from '../collection/links/error';

import errorHelper from '../../helpers/error-helper/index';

export const ROUTE_TRANSITION_ENVIRONMENT_SPACE = 'ROUTE_TRANSITION_ENVIRONMENT_SPACE';

export default function routeTransitionEnvironment() {
  return async dispatch => {
    dispatch({ type: ROUTE_TRANSITION_ENVIRONMENT_SPACE });

    // Fetch a list of all spaces.
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

    // Fetch a list of all doorways.
    const doorways = errorHelper({
      try: () => core.doorways.list({environment: true}),
      catch: error => {
        dispatch(collectionDoorwaysError(error));
      },
      else: async request => {
        const doorways = await request;
        dispatch(collectionDoorwaysSet(doorways.results));
      },
    });

    // Fetch a list of all links.
    const links = errorHelper({
      try: () => core.links.list(),
      catch: error => {
        dispatch(collectionLinksError(error));
      },
      else: async request => {
        const links = await request;
        dispatch(collectionLinksSet(links.results));
      },
    });

    return Promise.all([spaces, doorways, links]);
  };
}
