import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux'

import login from './login';
import user from './user';
import organization from './organization';
import spaces from './spaces';
import doorways from './doorways';
import events from './events';

export default combineReducers({
  login,
  user,
  organization,
  spaces,
  doorways,
  events,
  routing: routerReducer
});