import * as React from 'react';
import classnames from 'classnames';

const MDASH = String.fromCharCode(8212);

export default function PercentageBar({
  percentage,
  percentageFormatter,
}) {
  percentageFormatter = percentageFormatter || (n => `${n.toFixed(2)}%`);

  // Ensure that percentage never overflows the bar.
  if (percentage > 1) {
    percentage = 1;
  }

  const formattedPercentage = percentageFormatter(percentage);

  return <div className="percentage-bar-container">
    <div className="percentage-bar">
      <div className="percentage-bar-colored-section" style={{width: `${percentage * 100}%`}} />
    </div>
    <span className={classnames("percentage-bar-text", formattedPercentage === null ? 'disabled' : null)}>
      {formattedPercentage === null ? MDASH : formattedPercentage}
    </span>
  </div>;
}
