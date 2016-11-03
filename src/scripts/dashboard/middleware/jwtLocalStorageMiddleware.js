// JWT middleware to store jwt in localstorage
// We should sync this with a reducer because that's the right thing to do.
const jwtLocalStorageMiddleware = store => next => action => {
  switch (action.type) {
    case 'CHANGE_JWT':
      window.localStorage.jwt = action.jwt;
      break;
    case 'DELETE_JWT':
      delete window.localStorage.jwt;
      break;
  }

  // Pass through the action
  return next(action);
}

export default jwtLocalStorageMiddleware;