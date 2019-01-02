export const COLLECTION_LINKS_ERROR = 'COLLECTION_LINKS_ERROR';

export default function collectionLinksError(error) {
  // Convert error objects to strings.
  if (error instanceof Error) {
    error = error.toString();
  }
  return {type: COLLECTION_LINKS_ERROR, error};
}
