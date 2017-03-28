import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux'
import {push} from 'react-router-redux';

import alerts from './alerts';
import billing from './billing';
import doorways from './doorways';
import eventCount from './event-count';
import events from './events';
import integrations from './integrations';
import login from './login';
import organization from './organization';
import rawEvents from './raw-events';
import sensors from './sensors';
import sidebar from 'dashboard/ducks/sidebar';
import spaces from './spaces';
import totalVisits from './total-visits';
import user from './user';

const appReducer = combineReducers({
  alerts,
  billing,
  doorways,
  eventCount,
  events,
  integrations,
  login,
  organization,
  rawEvents,
  sensors,
  sidebar,
  spaces,
  totalVisits,
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