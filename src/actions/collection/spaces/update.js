import collectionSpacesPush from './push';
import { core } from '@density-int/client';

export const COLLECTION_SPACES_UPDATE = 'COLLECTION_SPACES_UPDATE';

export default function collectionSpacesUpdate(space) {
  return dispatch => {
    dispatch({ type: COLLECTION_SPACES_UPDATE, space });
    return core.spaces.update({
      id: space.id,
      name: space.name,
      description: space.description,
    }).then(link => {
      dispatch(collectionSpacesPush(link));
    });
  };
}
