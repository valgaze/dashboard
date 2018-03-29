import * as React from 'react';

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
    class RealtimeComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = { lastFrame: window.performance.now() };
        this.shouldComponentUpdate = shouldComponentUpdate || this.shouldComponentUpdate;
        this.tick = this.tick.bind(this);

        // this.visiblilityChangeListener = () => {
        // }
      }
      componentDidMount() {
        this.raf = window.requestAnimationFrame(this.tick);
        // window.addEventListener('visibilitychange', this.visiblilityChangeListener);
      }
      componentWillUnmount() {
        // window.removeEventListener('visibilitychange', this.visiblilityChangeListener);
        window.cancelAnimationFrame(this.raf);
      }
      tick() {
        const now = window.performance.now();
        if (this.state.lastFrame < now - AUTO_REFRESH_OLD_RAF_DELTA_IN_MILLISECONDS) {
          if (this.wakeUpRafAfterPageInactivity) {
            window.clearInterval(this.wakeUpRafAfterPageInactivity)
          }
          this.wakeUpRafAfterPageInactivity = window.setTimeout(() => {
            this.setState({ lastFrame: performance.now() });
            this.raf = window.requestAnimationFrame(this.tick);
          }, AUTO_REFRESH_DEBOUNCE_TIMEOUT_IN_MILLISECONDS);
          return
        }

        this.setState({ lastFrame: now });

        this.raf = window.requestAnimationFrame(this.tick);
      }
      render() {
        return React.createElement(Component, this.props);
        // return <Component {...this.props}>;
      }
    }


    RealtimeComponent.displayName = `AutoRefresh(${
      Component.displayName || Component.name || 'Component'
    })`
    return RealtimeComponent;
  };
}
