import collectionSpacesPush from './push';
import collectionSpacesError from './error';
import { core } from '@density-int/client';

export const COLLECTION_SPACES_RESET_COUNT = 'COLLECTION_SPACES_RESET_COUNT';

export default function collectionSpacesResetCount(item, newCount) {
  return async dispatch => {
    dispatch({ type: COLLECTION_SPACES_RESET_COUNT, item, newCount });

    try {
      const response = await core.spaces.reset({
        id: item.id,
        count: newCount,
      });
      dispatch(collectionSpacesPush({...item, currentCount: newCount}));
      return response;
    } catch (err) {
      dispatch(collectionSpacesError(err));
      return false;
    }
  };
}
