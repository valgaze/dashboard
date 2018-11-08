import stringToBoolean from '../string-to-boolean/index';

export default function unsafeNavigateToLandingPage(settings) {
  // If there is a URL hash present, don't redirect to any default page
  if (['', '#', '#/', '#/login'].indexOf(window.location.hash) < 0) {
    return;
  // If the dashbards page is enabled, redirect to the dashboards page on first navigation
  } else if (stringToBoolean(settings.dashboardsEnabled)) {
    window.location.hash = '#/dashboards';
  // If the explore page is locked, redirect to the onboarding flow.
  } else if (stringToBoolean(settings.insightsPageLocked || settings.explorePageLocked)) {
    window.location.hash = '#/onboarding/overview';
  // Otherwise land on the explore page
  } else {
    window.location.hash = '#/spaces/explore';
  }
}
