import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux'
import {push} from 'react-router-redux';

import appbar from './appbar';
import login from './login';
import user from './user';
import organization from './organization';
import spaces from './spaces';
import doorways from './doorways';
import events from './events';
import totalVisitors from './total-visitors';


const appReducer = combineReducers({
  appbar,
  login,
  user,
  organization,
  spaces,
  doorways,
  events,
  totalVisitors,
  routing: routerReducer
})

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT_USER') {
    const {routing} = state;
    state = {routing}
  }

  return appReducer(state, action)
}

export default rootReducer;