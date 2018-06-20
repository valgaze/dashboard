import { EventEmitter } from 'events';
import objectSnakeToCamel from '../object-snake-to-camel/index';

import logger from '../logger/index';

import { core } from '../../client';

// If disconnected, try to connect at minimum this often.
const MINIMUM_CONNECTION_INTERVAL = 500;

// Every 60 seconds, send a ping on the websocket connection. This is to ensure that it stays open.
const WEBSOCKET_PING_MESSAGE_INTERVAL_IN_SECONDS = 60 * 1000;

export const CONNECTION_STATES = {
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

    this.log = logger('density:websocket-event-pusher');

    this.gracefulDisconnect = false;
    this._connectionState = CONNECTION_STATES.CLOSED;
    this.emit('connectionStateChange', this._connectionState);

    this.socket = null;
    this.connect()
  }

  async connect(iteration=0) {
    this.log({type: 'CONNECTING_TO_SOCKET', iteration});
    if (!this.WebSocket) {
      return false;
    }

    // If connected already, close the connection before connecting again.
    if (this.connectionState === CONNECTION_STATES.CONNECTED) {
      this.log({type: 'SOCKET_ALREADY_DISCONNECTED', iteration});
      return false;
    }

    // Ensure that only one connection can occur at a time.
    if (this.connectionState === CONNECTION_STATES.WAITING_FOR_SOCKET_URL || this.connectionState === CONNECTION_STATES.CONNECTING) {
      this.log({type: 'SOCKET_CONNECTION_ALREADY_IN_PROGRESS'});
      return false;
    }

    if (!core.config().token) {
      this.log({type: 'NO_TOKEN_SET_IN_CORE_API'});
      return false;
    }

    // Start the socket url connection process
    this.connectionState = CONNECTION_STATES.WAITING_FOR_SOCKET_URL;

    try {
      const response = await core.sockets.create();

      this.connectionState = CONNECTION_STATES.CONNECTING;

      this.socket = new this.WebSocket(response.url);
      this.socket.onopen = () => {
        this.connectionState = CONNECTION_STATES.CONNECTED;

        this.log({type: 'CONNECTED_TO_SOCKET', tries: iteration});

        // When a successful connection occurs, reset the iteration count back to zero so that the
        // backoff is reset.
        iteration = 0;
        this.emit('connected');

        // Every one and a while, send a message to the server to keep the websocket message alive.
        this.pingIntervalId = window.setInterval(() => {
          this.log({type: 'SOCKET_PERIODIC_PING'});
          this.socket.send('"ping"');
        }, WEBSOCKET_PING_MESSAGE_INTERVAL_IN_SECONDS);
      };

      // Currently, the only events are space updates.
      this.socket.onmessage = e => {
        this.log({type: 'SOCKET_MESSAGE_RECEIVED', data: e.data});
        this.emit('space', objectSnakeToCamel(JSON.parse(e.data)).payload);
      }

      // When the connection disconnects, reconnect after a delay.
      this.socket.onclose = () => {
        this.connectionState = CONNECTION_STATES.CLOSED;
        this.log({type: 'SOCKET_CLOSE'});
        this.emit('disconnect');

        // Clear the interval that sends a ping to the sockets server if it is open.
        if (this.pingIntervalId) {
          window.clearInterval(this.pingIntervalId);
        }

        if (this.gracefulDisconnect) {
          this.log({type: 'SOCKET_GRACEFUL_DISCONNECT'});
          this.gracefulDisconnect = false;
          return;
        }

        // We're not gracefully disconnecting, so try to reconnect.

        // Calculate the timeout before the next reconnect attempt. Use an exponential backoff.
        const backoffTimeout = MINIMUM_CONNECTION_INTERVAL + (Math.pow(iteration, 2) * 1000);

        // Queue up the next attempt to reconnect to the socket server.
        setTimeout(() => this.connect(iteration+1), backoffTimeout);

        // Reset the graceful disconenct value after perfoming the disconnect (ie, default to a
        // non-graceful disconnect)
        this.gracefulDisconnect = false;
      };

      this.emit('fetchedUrl');
    } catch (error) {
      // An error occured while connection. so log it and try to reconnect.
      this.connectionState = CONNECTION_STATES.ERROR;
      this.log({type: 'SOCKET_ERROR', error});

      // Attempt to reconnect after an error.

      // Calculate the timeout before the next reconnect attempt. Use an exponential backoff.
      const backoffTimeout = MINIMUM_CONNECTION_INTERVAL + (Math.pow(iteration, 2) * 1000);

      // Queue up the next attempt to reconnect to the socket server.
      setTimeout(() => this.connect(iteration+1), backoffTimeout);
    }
  }

  // When the connection state is set, log and emit an event.
  get connectionState() {
    return this._connectionState;
  }
  set connectionState(value) {
    this._connectionState = value;
    this.log({type: 'CONNECTION_STATE_UPDATE', value});
    this.emit('connectionStateChange', this.connectionState);
  }

  disconnect() {
    this.log({type: 'INITIATING_GRACEFUL_DISCONNECT'})
    this.gracefulDisconnect = true;
    if (this.socket) {
      this.socket.close();
    }

    this.connectionState = CONNECTION_STATES.CLOSED;
  }
}
