import {combineReducers} from 'redux';

import login from './login';
import organization from './organization';

export default combineReducers({
  login,
  organization
});