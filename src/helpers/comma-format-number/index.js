export const cache = {};

export default function commaFormatNumber(n, commaCharacter=',', commaDistance=3) {
  // If the function wasn't passed a string to operate on (such as, for example, a `Number`),
  // convert to a string.
  if (typeof n !== 'string') {
    n = n.toString();
  }

  // SInce this function is pure, attempt to take advantage of caching. Repeated calls
  if (cache[`${n};${commaCharacter};${commaDistance}`]) {
    return cache[`${n};${commaCharacter};${commaDistance}`];
  }

  // Loop through each digit of the number, starting at the last digit.
  // Every loop iteration, move `commaDistance` to the left in the digits array and add a comma.
  const digits = n.split('');
  for (let i = digits.length - commaDistance; i >= 1; i -= commaDistance) {
    digits.splice(i, 0, commaCharacter);
  }

  // Combine all digits together. Return the result.
  cache[`${n};${commaCharacter};${commaDistance}`] = digits.join('');
  return cache[`${n};${commaCharacter};${commaDistance}`];
}
