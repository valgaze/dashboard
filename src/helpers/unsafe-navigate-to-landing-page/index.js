import stringToBoolean from '../string-to-boolean/index';

export default function unsafeNavigateToLandingPage(insightsPageLocked) {
  // If there is a URL hash present, don't redirect to any default page
  if (['', '#', '#/', '#/login'].indexOf(window.location.hash) < 0) {
    return;
  // If the insights page is locked, redirect to the onboarding flow.
  } else if (stringToBoolean(insightsPageLocked)) {
    window.location.hash = '#/onboarding/overview';
  // Otherwise land on the insights page
  } else {
    window.location.hash = '#/insights/spaces';
  }
}
