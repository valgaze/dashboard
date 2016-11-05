import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux'

import login from './login';
import user from './user';
import organization from './organization';
import spaces from './spaces';

export default combineReducers({
  login,
  user,
  organization,
  spaces,
  routing: routerReducer
});