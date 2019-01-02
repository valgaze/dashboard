export const COLLECTION_TIME_SEGMENT_GROUPS_SET = 'COLLECTION_TIME_SEGMENT_GROUPS_SET';

export default function collectionTimeSegmentGroupsSet(segments) {
  return { type: COLLECTION_TIME_SEGMENT_GROUPS_SET, data: segments };
}
