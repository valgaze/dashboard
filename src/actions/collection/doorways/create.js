import collectionDoorwaysPush from './push';

export const COLLECTION_DOORWAYS_CREATE = 'COLLECTION_DOORWAYS_CREATE';

export default function collectionDoorwaysCreate(doorway) {
  return dispatch => {
    // TODO: create doorway on the server
    dispatch({ type: COLLECTION_DOORWAYS_CREATE, doorway });
    doorway.id = Math.random().toString();
    dispatch(collectionDoorwaysPush(doorway));
  };
}
