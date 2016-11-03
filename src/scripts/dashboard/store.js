import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import jwtLocalStorageMiddleware from 'dashboard/middleware/jwtLocalStorageMiddleware'
import reducer from 'dashboard/reducers/reducer';

const store = createStore(reducer, {}, compose(
  applyMiddleware(thunk, jwtLocalStorageMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

export default store;
