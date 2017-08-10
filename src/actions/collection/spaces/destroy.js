import collectionSpacesDelete from './delete';
import collectionSpacesError from './error';
import { core } from '@density-int/client';

export const COLLECTION_SPACES_DESTROY = 'COLLECTION_SPACES_DESTROY';

export default function collectionSpacesDestroy(space) {
  return async dispatch => {
    dispatch({ type: COLLECTION_SPACES_DESTROY, space });

    try {
      await core.spaces.delete({id: space.id});
      dispatch(collectionSpacesDelete(space));
    } catch (err) {
      dispatch(collectionSpacesError(err));
    }
  };
}
