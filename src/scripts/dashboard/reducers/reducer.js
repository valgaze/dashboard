import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux'

import login from './login';
import tokens from './tokens';

export default combineReducers({
  login,
  tokens,
  routing: routerReducer
});