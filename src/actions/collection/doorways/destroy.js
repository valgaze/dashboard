import collectionDoorwaysDelete from './delete';
import { core } from '@density-int/client';

export const COLLECTION_DOORWAYS_DESTROY = 'COLLECTION_DOORWAYS_DESTROY';

export default function collectionDoorwaysDestroy(doorway) {
  return dispatch => {
    dispatch({ type: COLLECTION_DOORWAYS_DESTROY, doorway });

    return core.doorways.delete({id: doorway.id}).then(() => {
      dispatch(collectionDoorwaysDelete(doorway));
    });
  };
}
