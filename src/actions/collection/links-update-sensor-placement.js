import collectionLinksPush from './links-push';

export default function collectionLinksUpdateSensorPlacement(link) {
  return dispatch => {
    // TODO: update sensor placement on server.
    dispatch(collectionLinksPush(link));
  };
}
