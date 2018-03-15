import assert from 'assert';
import sinon from 'sinon';

import WebsocketEventPusher, { CONNECTION_STATES } from './index';

import { core } from '../../client';

function timeout(delay) {
  return new Promise(r => setTimeout(r, delay));
}

describe('websocket-event-pusher', function() {
  describe('with a connected socket', () => {
    // Before each test, connect to a mock socket.
    let eventSource, wsResponse, wsMock;
    beforeEach(() => new Promise((resolve, reject) => {
      // Define a token
      core.config({token: 'ses_XXX'});

      // Mock the impending request that is going to be made to the core api to get a sockets url
      global.fetch = sinon.stub().resolves({
        ok: true,
        status: 200,
        clone() { return this; },
        json: () => Promise.resolve({
          url: 'wss://sockets.density.io:8443/v1?code=foo',
          ttl: 300,
        }),
      });

      // Mock the websockets object
      wsResponse = {
        close() { return this.onclose() },
      };
      wsMock = sinon.stub().returns(wsResponse);

      // Create a new websocket event pusher with the mock websockets object
      eventSource = new WebsocketEventPusher(wsMock);

      // Verify that the socket is starting to connect
      assert.equal(eventSource.connectionState, CONNECTION_STATES.WAITING_FOR_SOCKET_URL);

      eventSource.on('connected', () => {
        // Verify that the socket is fully connected.
        assert.equal(eventSource.connectionState, CONNECTION_STATES.CONNECTED);

        // Ensure that the request to get the websocket url was made correctly
        assert.deepEqual(global.fetch.firstCall.args, ['https://api.density.io/v1/sockets', {
          method: 'POST',
          url: 'https://api.density.io/v1/sockets',
          desc: 'Create a new socket connection.',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ses_XXX',
          },
          body: undefined,
        }]);

        // Ensure that the correct url was connected to by the websocket client
        assert.equal(wsMock.firstCall.args[0], 'wss://sockets.density.io:8443/v1?code=foo');

        resolve();
      });

      // Ensure that after fetching the websocket url that the websocket is connected to.
      eventSource.on('fetchedUrl', () => {
        // Verify that the socket is connecting
        assert.equal(eventSource.connectionState, CONNECTION_STATES.CONNECTING);

        // Open the mock websocket
        wsResponse.onopen();
      });
    }));

    it('should properly receive an event', () => {
      // Listen for space count change events
      const spaceListener = sinon.spy();
      eventSource.on('space', spaceListener);

      // Emit an event on the websocket
      wsResponse.onmessage({data: JSON.stringify({
        version: "v2",
        organization_id: "org_XXX",
        payload: {
          type: "count",
          count: 15,
          direction: -1,
          event_id: "evt_foo",
          space_id: "spc_bar",
          timestamp: "2018-02-26T17:40:33.792Z",
        },
      })});

      // And verify that the event made it through to the 
      assert.equal(spaceListener.callCount, 1);
      assert.deepEqual(spaceListener.firstCall.args[0], {
        type: "count",
        count: 15,
        direction: -1,
        eventId: "evt_foo",
        spaceId: "spc_bar",
        timestamp: "2018-02-26T17:40:33.792Z",
      });
    });

    it(`should try to connect to the socket again after it has already been connected`, async () => {
      // Reset the histry of the fetch mock
      global.fetch.resetHistory();

      // Reconnect
      eventSource.connect();

      // Delay to ensure that the socket has time to connect if it were to connect again.
      await timeout(250);

      // Verify that the socket is still connected.
      assert.equal(eventSource.connectionState, CONNECTION_STATES.CONNECTED);
    });

    it('should close the socket and the socket should reconnect', async () => {
      // Reset the histry of the fetch mock
      global.fetch.resetHistory();

      // Forcefully close the socket.
      wsResponse.close();

      // Advance the timer by > 1s. The mimimum reconnection period is 1 second, so after this line
      // the socket should have reconnected.
      await timeout(250);

      // Verify that the socket is fully connected.
      assert.equal(eventSource.connectionState, CONNECTION_STATES.CONNECTED);
    });
    it(`should close the socket gracefully, which shouldn't cause it to reconnect`, async () => {
      // Reset the histry of the fetch mock
      global.fetch.resetHistory();

      // Gracefully close the socket.
      eventSource.disconnect();

      // Delay to ensure that the socket has time to connect if it were to connect again.
      await timeout(250);

      // Verify that the socket is closed.
      assert.equal(eventSource.connectionState, CONNECTION_STATES.CLOSED);
    });

    it(`should close the socket gracefully, which shouldn't cause it to reconnect`, async () => {
      // Reset the histry of the fetch mock
      global.fetch.resetHistory();

      // Gracefully close the socket.
      eventSource.disconnect();

      // Delay to ensure that the socket has time to connect if it were to connect again.
      await timeout(250);

      // Verify that the socket is closed.
      assert.equal(eventSource.connectionState, CONNECTION_STATES.CLOSED);
    });
  });
});
