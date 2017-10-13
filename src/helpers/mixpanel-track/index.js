import Mixpanel from 'mixpanel';

let mixpanel = null;

export default function mixpanelTrack(...args) {
  if (process.env.REACT_APP_MIXPANEL_TOKEN) {
    // Create a mixpanel singleton if it doesn't already exist.
    if (!mixpanel) {
      mixpanel = Mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, {protocol: 'https'});
    }

    // Proxy through a call to `mixpanel.track`
    return mixpanel.track.apply(mixpanel, args);
  } else {
    // No mixpanel token, skip tracking analytics...
    return false;
  }
}
