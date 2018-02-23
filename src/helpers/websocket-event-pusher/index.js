import { EventEmitter } from 'events';
import objectSnakeToCamel from '../object-snake-to-camel/index';

import { core } from '../../client';

// If disconnected, try to connect at minimum this often.
const MINIMUM_CONNECTION_INTERVAL = 1000;

// Conenct the the websocket.
let ws;
const events = new EventEmitter();
export function connect(WebSocket, iteration=0) {
  if (WebSocket && host && token) {
    return core.sockets.create().then(({url}) => {
      ws = new WebSocket(url);
      ws.onopen = () => {
        // When a successful connection occurs, reset the iteration count back to zero.
        iteration = 0;
        events.emit('connected');
      };

      // Currently, the only events are space updates.
      ws.onmessage = e => events.emit('space', objectSnakeToCamel(JSON.parse(e.data)));

      // When connection disconnects, reconnect after a delay.
      ws.onclose = () => {
        events.emit('disconnect');

        // Calculate the timeout before the next reconnect attempt. Use an exponential backoff.
        const backoffTimeout = MINIMUM_CONNECTION_INTERVAL + (Math.pow(iteration, 2) * 1000);

        // Queue up the next attempt to reconnect to the socket server.
        setTimeout(() => connect(WebSocket, iteration+1), backoffTimeout);
      };
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
