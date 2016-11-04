import {combineReducers} from 'redux';

import user from './user';
import organization from './organization';

export default combineReducers({
  user,
  organization
});