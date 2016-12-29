import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux'
import {push} from 'react-router-redux';

import appbar from './appbar';
import doorways from './doorways';
import events from './events';
import login from './login';
import organization from './organization';
import rawEvents from './raw-events';
import spaces from './spaces';
import totalVisitors from './total-visitors';
import user from './user';



const appReducer = combineReducers({
  appbar,
  doorways,
  events,
  login,
  organization,
  rawEvents,
  spaces,
  totalVisitors,
  user,
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