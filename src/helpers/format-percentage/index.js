export default function formatPercentage(percent, decimals=2) {
  let fixedPercent = (percent * 100).toFixed(decimals);

  // Remove zeros and decimal points from the end of the capacity.
  while (fixedPercent.endsWith('0')) {
    fixedPercent = fixedPercent.slice(0, -1);
  }

  // Remove a trailing decimal point.
  if (fixedPercent.endsWith('.')) {
    fixedPercent = fixedPercent.slice(0, -1);
  }

  return fixedPercent;
}
