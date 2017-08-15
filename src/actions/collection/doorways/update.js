import collectionDoorwaysPush from './push';
import collectionDoorwaysError from './error';
import { core } from '@density-int/client';

export const COLLECTION_DOORWAYS_UPDATE = 'COLLECTION_DOORWAYS_UPDATE';

export default function collectionDoorwaysUpdate(item) {
  return async dispatch => {
    dispatch({ type: COLLECTION_DOORWAYS_UPDATE, item });

    try {
      const response = await core.doorways.update({
        id: item.id,
        name: item.name,
        description: item.desc,
      });
      dispatch(collectionDoorwaysPush(response));
      return response;
    } catch (err) {
      dispatch(collectionDoorwaysError(err));
      return false;
    }
  };
}
