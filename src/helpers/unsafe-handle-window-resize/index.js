import resetDashboardReportGridIdentityValue from '../../actions/miscellaneous/reset-dashboard-report-grid-identity-value';

export default function unsafeHandleWindowResize(store) {
  let resizeTimeout = false;
  function resizeDispatch() {
    store.dispatch(resetDashboardReportGridIdentityValue());
  }
  function resizeHandler() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeDispatch, 300);
  }
  window.addEventListener('resize', resizeHandler);
  return resizeHandler;
}
