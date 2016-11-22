import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'

import jwtLocalStorageMiddleware from 'dashboard/middleware/jwtLocalStorageMiddleware'
import reducer from 'dashboard/reducers/reducer';

const reduxRouterMiddleware = routerMiddleware(browserHistory);
const store = createStore(reducer, {}, compose(
  applyMiddleware(reduxRouterMiddleware, thunk, jwtLocalStorageMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

export default store;
