export default function formatCapacityPercentage(count, capacity, decimals=2) {
  if (!capacity) {
    return null;
  } else {
    const percent = (count / capacity) * 100;
    let fixedPercent = percent.toFixed(decimals);

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
}
