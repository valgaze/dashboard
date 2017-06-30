import collectionLinksPush from './push';
import { core } from '@density-int/client';

export const COLLECTION_LINKS_CREATE = 'COLLECTION_LINKS_CREATE';

export default function collectionLinksCreate(spaceId, doorwayId, sensorPlacement) {
  return dispatch => {
    dispatch({ type: COLLECTION_LINKS_CREATE, spaceId, doorwayId, sensorPlacement });
    return core.links.create({
      space_id: spaceId,
      doorway_id: doorwayId,
      sensor_placement: sensorPlacement,
    }).then(link => {
      dispatch(collectionLinksPush(link));
    });
  };
}
