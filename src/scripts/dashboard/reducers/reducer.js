import {combineReducers} from 'redux';

import login from './login';
import tokens from './tokens';

export default combineReducers({
  login,
  tokens
});