import collectionSpacesDelete from './delete';
import { core } from '@density-int/client';

export const COLLECTION_SPACES_DESTROY = 'COLLECTION_SPACES_DESTROY';

export default function collectionSpacesDestroy(space) {
  return dispatch => {
    dispatch({ type: COLLECTION_SPACES_DESTROY, space });

    return core.spaces.delete({id: space.id}).then(() => {
      dispatch(collectionSpacesDelete(space));
    });
  };
}
