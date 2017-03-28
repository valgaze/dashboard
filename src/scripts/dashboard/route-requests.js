import {hashHistory} from 'react-router';
import store from 'dashboard/store';
import {syncHistoryWithStore} from 'react-router-redux'

import fetchParam from 'dashboard/helpers/fetch-param';

import {alertsIndex} from 'dashboard/actions/alerts';
import {getCustomer} from 'dashboard/actions/billing';
import {doorway} from 'dashboard/ducks/doorways';
import {eventCountFetch} from 'dashboard/actions/event-count';
import {eventsIndex} from 'dashboard/actions/events';
import {servicesIndex, servicesSlackChannels, servicesSendSlackCode} from 'dashboard/actions/integrations';
import {token} from 'dashboard/actions/tokens';
import {sensorsIndex} from 'dashboard/actions/sensors';
import {spacesIndex, spacesRead} from 'dashboard/actions/spaces';
import {totalVisitsFetch} from 'dashboard/actions/total-visits';
import {rawEventsFetch} from 'dashboard/actions/raw-events';

const history = syncHistoryWithStore(hashHistory, store);

var spacesReadInterval;
var spacesIndexInterval;

// there is a weird bug where the history.listen gets fired twice, not sure what it is yet
// but either way, this is a terrible way to fix it
// ......
var requestNum = 3; 

history.listen(location => {
  if (requestNum==1 || requestNum==3) {
    clearInterval(spacesIndexInterval);
    clearInterval(spacesReadInterval);
    if (location.pathname === "/") {
      window.localStorage.token ? hashHistory.push('/spaces') : hashHistory.push('/login');
    } else if (location.pathname === "/tokens") {
      store.dispatch(spacesIndex());
      store.dispatch(doorway.list());
      store.dispatch(token.list());
      store.dispatch(eventsIndex(1, 10));
    } else if (location.pathname.startsWith("/spaces/") && location.pathname.length > 8) {
      let state = store.getState();
      var spaceId = fetchParam(location);
      store.dispatch(doorway.list());
      store.dispatch(spacesRead(spaceId));
      store.dispatch(sensorsIndex());
      setTimeout(() => {
        // TODO: Remove this— it's only necessary right now because we're not passing in the timezone
        store.dispatch(totalVisitsFetch(spaceId));
        store.dispatch(eventCountFetch(state.eventCount.date, spaceId));
      }, 1000);
      store.dispatch(rawEventsFetch(state.rawEvents.startDate, state.rawEvents.endDate, 1, 10, spaceId));
      spacesReadInterval = setInterval(() => {
        store.dispatch(spacesRead(spaceId));
      }, 2000);
    } else if (location.pathname === "/spaces") {
      store.dispatch(spacesIndex());
      spacesIndexInterval = setInterval(() => {
        store.dispatch(spacesIndex());
      }, 2000);
    } else if (location.pathname === "/integrations/alerts") {
      if (location.query.code) {
        store.dispatch(servicesSendSlackCode(location.query.code));
      } else {
        store.dispatch(servicesSlackChannels());
        store.dispatch(alertsIndex());
        store.dispatch(servicesIndex());
      }
      store.dispatch(spacesIndex());
    } else if (location.pathname === "/account/billing") {
      store.dispatch(getCustomer());
    }
  }
  requestNum = (requestNum==1 || requestNum==3) ? 0 : 1;
});

export default history;