import collectionDoorwaysPush from './push';
import { core } from '@density-int/client';

export const COLLECTION_DOORWAYS_UPDATE = 'COLLECTION_DOORWAYS_UPDATE';

export default function collectionDoorwaysUpdate(doorway) {
  return dispatch => {
    dispatch({ type: COLLECTION_DOORWAYS_UPDATE, doorway });
    return core.doorways.update({
      id: doorway.id,
      name: doorway.name,
      description: doorway.description,
    }).then(link => {
      dispatch(collectionDoorwaysPush(link));
    });
  };
}
