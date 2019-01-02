export const COLLECTION_DOORWAYS_FILTER = 'COLLECTION_DOORWAYS_FILTER';

export default function collectionDoorwaysFilter(filter, value) {
  return { type: COLLECTION_DOORWAYS_FILTER, filter, value };
}
