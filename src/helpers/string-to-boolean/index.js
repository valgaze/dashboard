export default function stringToBoolean(value, defaultValue) {
  if (typeof value === 'boolean') { // Inputs that are literal booleans return their value.
    return value;
  } else if (!value) { // Unset flags return default or `false`.
    return defaultValue || false;
  } else {
    return ['true', 't'].indexOf(value.toLowerCase()) > -1;
  }
}
