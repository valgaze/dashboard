import * as React from 'react';
import Debug from 'debug';
const debug = Debug('density:auto-refresh-hoc');

// The age of a request animation frame from the current performance.now() value for it to be
// considered "old" and discarded. This is primarily used to detect frame backups when the user
// forgrounds the dashboard from a background tab. In other words, this value represents the oldest
// possible frame that will be rendered.
const AUTO_REFRESH_OLD_RAF_DELTA_IN_MILLISECONDS = 3000;

// The timeout after a tab has started to issue non "old" raf frames (see above threshold) that the
// raf loop is kicked off again. In other words, this is the delay after a tab becomes active again
// that the raf starts up.
const AUTO_REFRESH_DEBOUNCE_TIMEOUT_IN_MILLISECONDS = 200;

/*
 * let Component = ({myProp}) => <span>{myProp}</span>;
 * let NewComponent = autoRefresh({updateEveryMilliseconds: 500})(Component);
 * // Every 500 ms, NewComponent will be updated every 500 seconds.
 */

export default function autoRefresh({interval, shouldComponentUpdate}) {
  return Component => {
    class RealtimeComponent extends React.Component<any, any> {
      raf: any;
      wakeUpRafAfterPageInactivity: any;

      constructor(props) {
        super(props);
        this.state = { lastFrame: window.performance.now() };
        this.shouldComponentUpdate = shouldComponentUpdate || this.shouldComponentUpdate;
        this.tick = this.tick.bind(this);

        this.wakeUpRafAfterPageInactivity = null;
      }
      componentDidMount() {
        this.raf = window.requestAnimationFrame(this.tick);
      }
      componentWillUnmount() {
        window.cancelAnimationFrame(this.raf);
      }
      tick() {
        const now = window.performance.now();

        // Is the raf frame too old?
        if (this.state.lastFrame < now - AUTO_REFRESH_OLD_RAF_DELTA_IN_MILLISECONDS) {
          debug('Old raf frame detected! Dropping...');

          // If so, set up a debounce interval to re-enable the raf.
          if (this.wakeUpRafAfterPageInactivity !== null) {
            debug('Clearing raf interval, not the "oldest" old frame...');
            window.clearInterval(this.wakeUpRafAfterPageInactivity);
          }
          this.wakeUpRafAfterPageInactivity = window.setTimeout(() => {
            debug('Restarting raf loop. timeoutid=%o', this.wakeUpRafAfterPageInactivity);
            // Restart raf loop
            this.setState({ lastFrame: window.performance.now() });
            this.raf = window.requestAnimationFrame(this.tick);
            this.wakeUpRafAfterPageInactivity = null;
          }, AUTO_REFRESH_DEBOUNCE_TIMEOUT_IN_MILLISECONDS);

          // And then skip this raf iteration.
          return;
        }

        // Re-render the component.
        this.setState({ lastFrame: now });

        // And run the next frame.
        this.raf = window.requestAnimationFrame(this.tick);
      }
      render() {
        return React.createElement(Component, this.props);
        // return <Component {...this.props}>;
      }
    }


    (RealtimeComponent as any).displayName = `AutoRefresh(${
      Component.displayName || Component.name || 'Component'
    })`
    return RealtimeComponent;
  };
}
