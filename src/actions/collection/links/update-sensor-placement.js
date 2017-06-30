import collectionLinksPush from './push';

export default function collectionLinksUpdateSensorPlacement(link) {
  return dispatch => {
    // TODO: update sensor placement on server.
    dispatch(collectionLinksPush(link));
  };
}
