import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import reducer from 'dashboard/reducers/reducer';

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

const store = createStore(reducer, {}, compose(
  applyMiddleware(thunk, jwtLocalStorageMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

export default store;
