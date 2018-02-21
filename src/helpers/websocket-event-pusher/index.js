import { EventEmitter } from 'events';
import objectSnakeToCamel from '../object-snake-to-camel/index';

import { core } from '../../client';

// If disconnected, try to connect at minimum this often.
const MINIMUM_CONNECTION_INTERVAL = 5000;

// Conenct the the websocket.
let ws;
const events = new EventEmitter();
export function connect(WebSocket) {
  if (WebSocket && host && token) {
    return core.sockets.create().then(({url}) => {
      ws = new WebSocket(url);
      ws.onopen = () => events.emit('connected');

      // Currently, the only events are space updates.
      ws.onmessage = e => events.emit('space', objectSnakeToCamel(JSON.parse(e.data)));

      // When connection disconnects, reconnect after a delay.
      ws.onclose = () => setTimeout(() => connect(WebSocket), MINIMUM_CONNECTION_INTERVAL);
    });
  } else {
    return false;
  }
}

let host;
export function setHost(h) {
  if (h !== host) {
    host = h;
    ws ? ws.close() : connect(window.WebSocket);
  }
}

let token;
export function setToken(t) {
  if (t !== token) {
    token = t;
    ws ? ws.close() : connect(window.WebSocket);
  }
}

export default {
  setToken,
  setHost,
  events,
};
