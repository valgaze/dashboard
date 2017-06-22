export const COLLECTION_SPACES_SET = 'COLLECTION_SPACES_SET';

export default function collectionSpacesSet(spaces) {
  return { type: COLLECTION_SPACES_SET, data: spaces };
}
