export const COLLECTION_LINKS_SET = 'COLLECTION_LINKS_SET';

export default function collectionLinksSet(links) {
  return { type: COLLECTION_LINKS_SET, data: links };
}
