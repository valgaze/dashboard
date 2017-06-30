import collectionDoorwaysPush from './push';
import { core } from '@density-int/client';

export const COLLECTION_DOORWAYS_CREATE = 'COLLECTION_DOORWAYS_CREATE';

export default function collectionDoorwaysCreate(doorway) {
  return dispatch => {
    dispatch({ type: COLLECTION_DOORWAYS_CREATE, doorway });

    return core.doorways.create({
      name: doorway.name,
      description: doorway.desc,
    }).then(doorway => {
      dispatch(collectionDoorwaysPush(doorway));
    });
  };
}
