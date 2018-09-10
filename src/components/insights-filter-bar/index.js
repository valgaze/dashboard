import React, { Component } from 'react';
import classnames from 'classnames';

import gridVariables from '@density/ui/variables/grid.json';
import { navbarHeight } from '@density/ui-navbar/variables.json';

export default class InsightsFilterBar extends Component {
  state = {
    isFixed: false,
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    const position = this.tracker.getBoundingClientRect();
    const breakPoint = gridVariables.screenSmMin > window.innerWidth ? navbarHeight : 0;
    const isFixed = position.y < breakPoint;
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

      <div
        className={classnames('insights-filter-bar', {fixed: isFixed})}
        ref={r => { this.filterBar = r; }}
      >{bar}</div>

      {/*
      Render a second filter bar when fixed to replace the old one that became fixed. This is
      done so that the scroll position won't "jump" when the height of the old filter bar is
      removed.
      */}
      {isFixed ? <div
        className="insights-filter-bar-height-spacer"
        style={{height: this.filterBar.getBoundingClientRect().height}}
      /> : null}
    </div>;
  }
}

export function InsightsFilterBarItem({label, right, children}) {
  return <li className={classnames('insights-filter-bar-item', {right})}>
    <label className="insights-filter-bar-item-label">{label}</label>
    {children}
  </li>;
}
