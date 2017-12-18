import stringToBoolean from '../string-to-boolean/index';

export default function unsafeNavigateToLandingPage(insightsPageLocked) {
  // If the visualizations page is locked, instead redirect to the onboarding flow.
  if (stringToBoolean(insightsPageLocked)) {
    window.location.hash = '#/account/setup/overview';
  } else {
    window.location.hash = '#/insights/spaces';
  }
}
