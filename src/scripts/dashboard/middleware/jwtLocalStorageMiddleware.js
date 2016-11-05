const jwtLocalStorageMiddleware = store => next => action => {
  switch (action.type) {
    case 'SAVE_JWT_TO_LOCAL_STORAGE':
      window.localStorage.jwt = action.jwt;
      break;
    case 'DELETE_JWT_FROM_LOCAL_STORAGE':
      window.localStorage.removeItem('jwt');
      break;
  }

  return next(action);
}

export default jwtLocalStorageMiddleware;