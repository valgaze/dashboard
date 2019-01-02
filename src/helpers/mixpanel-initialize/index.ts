// Mixpanel, fix your code.
if (process.env.REACT_APP_MIXPANEL_TOKEN) {
  require('mixpanel-browser/mixpanel-jslib-snippet.min.js');
}

let initialized = false;

// Initialize mixpanel if it doesn't already exist.
export default function mixpanelInitialize() {
  if (process.env.REACT_APP_MIXPANEL_TOKEN && !initialized) {
    (window as any).mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, {protocol: 'https'});
    initialized = true;
  }
}
