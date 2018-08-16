import React from 'react';

import Switch from '@density/ui-switch';

export default function IncludeWeekendsSwitch(props) {
  return <div className="include-weekends-switch">
    <span className="include-weekends-switch-label">Include Weekends</span>
    <span className="include-weekends-switch-switch">
      <Switch {...props} />
    </span>
  </div>;
}
