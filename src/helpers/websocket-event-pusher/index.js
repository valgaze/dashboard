import { EventEmitter } from 'events';
import objectSnakeToCamel from '../object-snake-to-camel/index';

import { core } from '../../client';

// If disconnected, try to connect at minimum this often.
const MINIMUM_CONNECTION_INTERVAL = 1000;

export default class WebsocketEventPusher extends EventEmitter {
  constructor(WebSocket=window.WebSocket) {
    super();
    this.WebSocket = WebSocket;
    this.connect()
  }

  connect(iteration=0) {
    if (!this.WebSocket) {
      return false;
    }

    return core.sockets.create().then(({url}) => {
      const ws = new this.WebSocket(url);
      ws.onopen = () => {
        // When a successful connection occurs, reset the iteration count back to zero so that the
        // backoff is reset.
        iteration = 0;
        this.emit('connected');
      };

      // Currently, the only events are space updates.
      ws.onmessage = e => this.emit('space', objectSnakeToCamel(JSON.parse(e.data)).payload);

      // When the connection disconnects, reconnect after a delay.
      ws.onclose = () => {
        this.emit('disconnect');

        // Calculate the timeout before the next reconnect attempt. Use an exponential backoff.
        const backoffTimeout = MINIMUM_CONNECTION_INTERVAL + (Math.pow(iteration, 2) * 1000);

        // Queue up the next attempt to reconnect to the socket server.
        setTimeout(() => this.connect(iteration+1), backoffTimeout);
      };

      this.emit('fetchedUrl');
    });
  }
}
