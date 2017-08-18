import collectionLinksPush from './push';
import collectionLinksError from './error';
import { core } from '@density-int/client';

export const COLLECTION_LINKS_UPDATE_SENSOR_PLACEMENT = 'COLLECTION_LINKS_UPDATE_SENSOR_PLACEMENT';

export default function collectionLinksUpdateSensorPlacement(item) {
  return async dispatch => {
    // TODO: update sensor placement on server.
    dispatch({ type: COLLECTION_LINKS_UPDATE_SENSOR_PLACEMENT, item });

    try {
      const link = await core.links.update({
        id: item.id,
        sensor_placement: item.sensorPlacement,
      });
      dispatch(collectionLinksPush(link));
      return link;
    } catch (err) {
      dispatch(collectionLinksError(err));
      return false;
    }
  };
}
