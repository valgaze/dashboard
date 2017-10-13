import mixpanelInitialize from '../mixpanel-initialize/index';

export default function mixpanelTrack(...args) {
  if (process.env.REACT_APP_MIXPANEL_TOKEN) {
    // Initialize mixpanel
    mixpanelInitialize();

    // Proxy through a call to `mixpanel.track`
    return window.mixpanel.track.apply(window.mixpanel, args);
  } else {
    // No mixpanel token, skip tracking analytics...
    return false;
  }
}
