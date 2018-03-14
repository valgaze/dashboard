import * as React from 'react';

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
        this.state = { lastFrame: Date.now() };
        this.shouldComponentUpdate = shouldComponentUpdate || this.shouldComponentUpdate;
        this.tick = this.tick.bind(this);
      }
      componentDidMount() {
        this.raf = window.requestAnimationFrame(this.tick);
      }
      componentWillUnmount() {
        window.cancelAnimationFrame(this.raf);
      }
      tick() {
        if (document.hidden) { return; }
        var now = Date.now();
        if (now - this.state.lastFrame > interval) { this.setState({ lastFrame: now }); }
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
