export const COLLECTION_DASHBOARDS_SET = 'COLLECTION_DASHBOARDS_SET';

export default function collectionDashboardsSet(segments) {
  return { type: COLLECTION_DASHBOARDS_SET, data: segments };
}
