const localStorageMiddleware = store => next => action => {
  switch (action.type) {
    case 'SAVE_TOKEN_TO_LOCAL_STORAGE':
      window.localStorage.token = action.token;
      break;
    case 'SAVE_ORG_ID_TO_LOCAL_STORAGE':
      let orgId = action.json.auth.organization.id;
      window.localStorage.orgId = orgId;
      break;
    case 'DELETE_DATA_FROM_LOCAL_STORAGE':
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('orgId');
      break;
  }

  return next(action);
}

export default localStorageMiddleware;