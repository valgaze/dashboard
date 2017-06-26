export const COLLECTION_DOORWAYS_SET = 'COLLECTION_DOORWAYS_SET';

export default function collectionDoorwaysSet(doorways) {
  return { type: COLLECTION_DOORWAYS_SET, data: doorways };
}
