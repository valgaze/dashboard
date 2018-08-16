import React, { Component } from 'react';
import classnames from 'classnames';

export default class InsightsFilterBar extends Component {
  state = {
    isFixed: false,
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    const position = this.tracker.getBoundingClientRect();
    const isFixed = position.y < 0;
    if (this.state.isFixed !== isFixed) {
      this.setState({isFixed});
    }
  }

  render() {
    const { children } = this.props;
    const { isFixed } = this.state;


    const bar = (
      <ul className="insights-filter-bar-items">
        {children}
      </ul>
    );

    return <div>
      <div className="insights-filter-bar-tracker" ref={r => { this.tracker = r; }} />
      {isFixed ?  <div className="insights-filter-bar" /> : null}
      <div className={classnames('insights-filter-bar', {fixed: isFixed})}>{bar}</div>
    </div>;
  }
}

export function InsightsFilterBarItem({right, children}) {
  return <li className={classnames('insights-filter-bar-item', {right})}>{children}</li>;
}
