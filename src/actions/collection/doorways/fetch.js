import collectionDoorwaysSet from './set';
import collectionDoorwaysError from './error';
import { core } from '../../../client';

import errorHelper from '../../../helpers/error-helper/index';

export const COLLECTION_DOORWAYS_FETCH = 'COLLECTION_DOORWAYS_FETCH';

export default function collectionDoorwaysFetch() {
  return async dispatch => {
    dispatch({ type: COLLECTION_DOORWAYS_FETCH });

    // Fetch a list of all doorways.
    return errorHelper({
      try: () => core.doorways.list({environment: true}),
      catch: error => {
        dispatch(collectionDoorwaysError(error));
        return false;
      },
      else: async request => {
        const doorways = await request;
        dispatch(collectionDoorwaysSet(doorways.results));
        return doorways;
      },
    });
  };
}
