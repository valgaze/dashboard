export default function featureFlagEnabled(flagValue) {
  if (typeof flagValue === 'boolean') { // Flags that are literal booleans return their value.
    return flagValue;
  } else if (typeof flagValue === 'undefined') { // unset flags are `false`.
    return false;
  } else {
    return flagValue &&
      (flagValue.toLowerCase() === 'true' || flagValue.toLowerCase() === 't');
  }
}
