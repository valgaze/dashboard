import { EventEmitter } from 'events';
import objectSnakeToCamel from '../object-snake-to-camel/index';

import debug from 'debug';

import { core } from '../../client';

// If disconnected, try to connect at minimum this often.
const MINIMUM_CONNECTION_INTERVAL = 1000;

const CONNECTION_STATES = {
  CLOSED: 'CLOSED',
  WAITING_FOR_SOCKET_URL: 'WAITING_FOR_SOCKET_URL',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  ERROR: 'ERROR',
};

export default class WebsocketEventPusher extends EventEmitter {
  constructor(WebSocket=window.WebSocket) {
    super();
    this.WebSocket = WebSocket;

    this.log = debug('density:websocket-event-pusher');

    this.gracefulDisconnect = false;
    this.connectionState = CONNECTION_STATES.CLOSED;

    this.socket = null;
    this.connect()
  }

  async connect(iteration=0) {
    this.log('CONNECT TO SOCKET');
    if (!this.WebSocket) {
      return false;
    }

    // If connected already, close the connection before connecting again.
    if (this.connectionState === CONNECTION_STATES.CONNECTED) {
      this.log('SOCKET IS ALREADY CONNECTED, DISCONNECTING...');
      this.disconnect();
    }

    // Ensure that only one connection can occur at a time.
    if (this.connectionState === CONNECTION_STATES.WAITING_FOR_SOCKET_URL || this.connectionState === CONNECTION_STATES.CONNECTING) {
      this.log('SOCKET CONNECTION ALREADY IN PROGRESS');
      return false;
    }

    if (!core.config().token) {
      this.log('NO TOKEN SET, NOT CONNECTING TO SOCKET.');
      return false;
    }

    // Start the socket url connection process
    this.connectionState = CONNECTION_STATES.WAITING_FOR_SOCKET_URL;
    this.log('CONNECTION STATE UPDATE %o', this.connectionState);

    try {
      const response = await core.sockets.create();

      this.connectionState = CONNECTION_STATES.CONNECTING;
      this.log('CONNECTION STATE UPDATE: %o', this.connectionState);

      this.socket = new this.WebSocket(response.url);
      this.socket.onopen = () => {
        this.connectionState = CONNECTION_STATES.CONNECTED;
        this.log('CONNECTION STATE UPDATE: %o', this.connectionState);

        // When a successful connection occurs, reset the iteration count back to zero so that the
        // backoff is reset.
        iteration = 0;
        this.emit('connected');
      };

      // Currently, the only events are space updates.
      this.socket.onmessage = e => {
        this.log('SOCKET MESSAGE RECEIVED: %o', e.data);
        this.emit('space', objectSnakeToCamel(JSON.parse(e.data)).payload);
      }

      // When the connection disconnects, reconnect after a delay.
      this.socket.onclose = () => {
        this.log('SOCKET CLOSE');
        this.emit('disconnect');

        if (this.gracefulDisconnect) {
          return;
        }

        // Calculate the timeout before the next reconnect attempt. Use an exponential backoff.
        const backoffTimeout = MINIMUM_CONNECTION_INTERVAL + (Math.pow(iteration, 2) * 1000);

        // Queue up the next attempt to reconnect to the socket server.
        setTimeout(() => this.connect(iteration+1), backoffTimeout);
      };

      this.emit('fetchedUrl');
    } catch (err) {
      // Unlock the connection.
      this.connectionState = CONNECTION_STATES.ERROR;
      this.error('SOCKET ERROR', err);
    }
  }

  disconnect() {
    this.gracefulDisconnect = true;
    if (this.socket) {
      this.socket.close();
    }
    this.gracefulDisconnect = false;

    this.connectionState = CONNECTION_STATES.CLOSED;
  }
}
