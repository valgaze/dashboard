import formatPercentage from '../format-percentage/index';

export default function formatCapacityPercentage(count, capacity, decimals=2) {
  if (!capacity) {
    return null;
  } else {
    return formatPercentage(count / capacity, decimals);
  }
}
