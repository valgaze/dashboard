export default async function errorHelper(params /* {try, catch, finally, else} */) {
  let result = undefined,
      errorThrown = false;

  try {
    result = params.try();
  } catch (error) {
    errorThrown = error;
  } finally {
    params.finally && params.finally();
  }

  if (errorThrown && params.catch) {
    let catchResponse = params.catch(errorThrown);
    if (catchResponse instanceof Promise) { catchResponse = await catchResponse; }
    if (typeof catchResponse !== 'undefined') {
      result = catchResponse;
    }
  }

  if (!errorThrown && params.else) {
    const elseResponse = params.else(result);
    if (elseResponse instanceof Promise) { await elseResponse; }
    if (typeof elseResponse !== 'undefined') {
      result = elseResponse;
    }
  }

  return result;
}
