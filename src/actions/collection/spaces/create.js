import collectionSpacesPush from './push';

export const COLLECTION_SPACES_CREATE = 'COLLECTION_SPACES_CREATE';

export default function collectionSpacesCreate(space) {
  return dispatch => {
    dispatch({ type: COLLECTION_SPACES_CREATE, space });
    space.id = Math.random().toString();
    dispatch(collectionSpacesPush(space));
  };
}
