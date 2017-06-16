import camelcase from 'camelcase';

// Convert an object with snake case keys to camel case keys.
export default function objectSnakeToCamel(input) {
  const output = {};

  for (const key in input) {
    if (typeof key === 'string') {
      output[camelcase(key)] = input[key];
    } else {
      output[key] = input[key];
    }
  }

  return output;
}
