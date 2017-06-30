import collectionLinksPush from './push';
import { core } from '@density-int/client';

export const COLLECTION_LINKS_UPDATE = 'COLLECTION_LINKS_UPDATE';

export default function collectionLinksUpdate(doorway) {
  return dispatch => {
    dispatch({ type: COLLECTION_LINKS_UPDATE, doorway });
    return core.doorways.update({
      id: doorway.id,
      name: doorway.name,
      description: doorway.description,
    }).then(link => {
      dispatch(collectionLinksPush(link));
    });
  };
}
