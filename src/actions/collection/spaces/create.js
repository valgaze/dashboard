import collectionSpacesPush from './push';
import { core } from '@density-int/client';

export const COLLECTION_SPACES_CREATE = 'COLLECTION_SPACES_CREATE';

export default function collectionSpacesCreate(space) {
  return dispatch => {
    dispatch({ type: COLLECTION_SPACES_CREATE, space });

    return core.spaces.create({
      name: space.name,
      description: space.desc,
      timezone: space.timeZone,
      daily_reset: space.resetTime,
    }).then(space => {
      dispatch(collectionSpacesPush(space));
    });
  };
}
