import collectionSpacesPush from './push';
import collectionSpacesError from './error';
import { core } from '@density-int/client';

export const COLLECTION_SPACES_UPDATE = 'COLLECTION_SPACES_UPDATE';

export default function collectionSpacesUpdate(item) {
  return async dispatch => {
    dispatch({ type: COLLECTION_SPACES_UPDATE, item });

    try {
      const response = await core.spaces.update({
        id: item.id,
        name: item.name,
        description: item.desc,
      });
      dispatch(collectionSpacesPush(response));
      return response;
    } catch (err) {
      dispatch(collectionSpacesError(err));
      return false;
    }
  };
}
