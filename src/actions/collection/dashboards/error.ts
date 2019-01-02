export const COLLECTION_DASHBOARDS_ERROR = 'COLLECTION_DASHBOARDS_ERROR';

export default function collectionDashboardsError(error) {
  // Convert error objects to strings.
  if (error instanceof Error) {
    error = error.toString();
  }
  return {type: COLLECTION_DASHBOARDS_ERROR, error};
}
