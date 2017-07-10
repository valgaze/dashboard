import * as React from 'react';

/*
 * let Component = ({myProp}) => <span>{myProp}</span>;
 * let NewComponent = autoRefresh({updateEveryMilliseconds: 500})(Component);
 * // Every 500 ms, NewComponent will be updated every 500 seconds.
 */

export default function autoRefresh({interval}) {
  return Component => {
    class RealtimeComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          interval: setInterval(this.forceUpdate.bind(this), interval || 5000),
        };
      }
      componentWillUnmount() {
        clearInterval(this.state.interval);
      }

      render() {
        return React.createElement(Component, this.props);
        // return <Component {...this.props}>;
      }

      displayName = `AutoRefresh(${
        Component.displayName || Component.name || 'Component'
      })`
    }

    return RealtimeComponent;
  };
}
