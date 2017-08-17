export const COLLECTION_SPACES_SET = 'COLLECTION_SPACES_SET';

export default function collectionSpacesSet(spaces) {
  spaces[0].capacity = 20;
  spaces[0].currentCount = 8;
  return { type: COLLECTION_SPACES_SET, data: spaces };
}
