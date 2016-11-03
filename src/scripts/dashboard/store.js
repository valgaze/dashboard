import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import reducer from 'dashboard/reducers/reducer';
import jwtLocalStorageMiddleware from 'dashboard/middleware/jwtLocalStorageMiddleware'

const store = createStore(reducer, {}, compose(
  applyMiddleware(thunk, jwtLocalStorageMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

export default store;
