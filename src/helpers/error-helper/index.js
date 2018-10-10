export default function errorHelper(params /* {try, catch, finally, else} */) {
  let result = undefined,
      errorThrown = false;

  try {
    result = params.try();
  } catch (error) {
    errorThrown = error;
  } finally {
    params.finally && params.finally();
  }

  if (errorThrown) {
    params.catch && params.catch(errorThrown);
  }

  if (!errorThrown && params.else) {
    params.else(result);
  }

  return result;
}
