import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux'
import {push} from 'react-router-redux';

import login from './login';
import user from './user';
import organization from './organization';
import spaces from './spaces';
import doorways from './doorways';
import events from './events';

const appReducer = combineReducers({
  login,
  user,
  organization,
  spaces,
  doorways,
  events,
  routing: routerReducer
})

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT_USER') {
    const { routing } = state;
    state = { routing }
  }

  return appReducer(state, action)
}

export default rootReducer;