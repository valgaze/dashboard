import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import reducer from 'dashboard/reducers/reducer';


const store = createStore(reducer, {}, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

export default store;
