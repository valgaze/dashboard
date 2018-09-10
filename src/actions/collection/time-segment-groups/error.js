export const COLLECTION_TIME_SEGMENT_GROUPS_ERROR = 'COLLECTION_TIME_SEGMENT_GROUPS_ERROR';

export default function collectionTimeSegmentGroupsError(error) {
  // Convert error objects to strings.
  if (error instanceof Error) {
    error = error.toString();
  }
  return {type: COLLECTION_TIME_SEGMENT_GROUPS_ERROR, error};
}
