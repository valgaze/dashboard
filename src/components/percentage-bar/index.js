import * as React from 'react';

export default function PercentageBar({
  percentage,
  percentageFormatter,
}) {
  percentageFormatter = percentageFormatter || (n => `${n.toFixed(2)}%`);

  return <div className="percentage-bar-container">
    <div className="percentage-bar">
      <div className="percentage-bar-colored-section" style={{width: `${percentage * 100}%`}} />
    </div>
    <span className="percentage-bar-text">
      {percentageFormatter(percentage)}
    </span>
  </div>;
}
