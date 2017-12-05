import collectionDoorwaysPush from './push';
import collectionDoorwaysError from './error';
import { core } from '../../../client';

export const COLLECTION_DOORWAYS_CREATE = 'COLLECTION_DOORWAYS_CREATE';

export default function collectionDoorwaysCreate(item) {
  return async dispatch => {
    dispatch({ type: COLLECTION_DOORWAYS_CREATE, item });

    try {
      const response = await core.doorways.create({
        name: item.name,
        description: item.description,
        width: item.width,
        height: item.height,
        clearance: item.clearance,
        power_type: item.powerType,
      });
      dispatch(collectionDoorwaysPush(response));
      return response;
    } catch (err) {
      dispatch(collectionDoorwaysError(err));
      return false;
    }
  };
}
