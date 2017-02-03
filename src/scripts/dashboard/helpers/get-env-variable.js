export default function getEnvVariable(envVar, vartype, required=true, defaultValue) {
  if (typeof envVar === 'undefined') {
    // variable wasn't set
    if (required) {
      throw new Error(`Set environment variable`);
    } else {
      return defaultValue;
    }
  } else if (vartype === 'int') {
    // try to coerse to an int
    let parsedInt = parseInt(envVar);
    if (!isNaN(parsedInt)) {
      return parsedInt;
    } else {
      throw new Error(`Environment variable must be a number`);
    }
  } else if (vartype === 'bool') {
    // try to coerse to a bool
    if (envVar.toLowerCase() === 'true') {
      return true;
    } else {
      return false;
    }
  } else {
    // just a string
    return envVar;
  }
}
