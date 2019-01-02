export const COLLECTION_DOORWAYS_ERROR = 'COLLECTION_DOORWAYS_ERROR';

export default function collectionDoorwaysError(error) {
  // Convert error objects to strings.
  if (error instanceof Error) {
    error = error.toString();
  }
  return {type: COLLECTION_DOORWAYS_ERROR, error};
}
