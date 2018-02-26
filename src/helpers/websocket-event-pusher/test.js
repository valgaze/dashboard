import assert from 'assert';
import sinon from 'sinon';
import WebsocketEventPusher from './index';

describe('websocket-event-pusher', function() {
  it('should connect to the websocket by getting a url from the core api and emit events', function(done) {
    const promise = new Promise((resolve, reject) => {
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
      const wsResponse = {};
      const wsMock = sinon.stub().returns(wsResponse);

      // Create a new websocket event pusher with the mock websockets object
      const eventSource = new WebsocketEventPusher(wsMock);

      eventSource.on('connected', () => {
        // Ensure that the request to get the websocket url was made correctly
        assert.deepEqual(global.fetch.firstCall.args, ['https://api.density.io/v1/sockets', {
          method: 'POST',
          url: 'https://api.density.io/v1/sockets',
          desc: 'Create a new socket connection.',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ',
          },
          body: undefined,
        }]);

        // Ensure that the correct url was connected to by the websocket client
        assert.equal(wsMock.firstCall.args[0], 'wss://sockets.density.io:8443/v1?code=foo');

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

        assert.equal(spaceListener.callCount, 1);
        assert.deepEqual(spaceListener.firstCall.args[0], {
          type: "count",
          count: 15,
          direction: -1,
          eventId: "evt_foo",
          spaceId: "spc_bar",
          timestamp: "2018-02-26T17:40:33.792Z",
        });

        resolve();
      });

      // Ensure that after fetching the websocket url that the websocket is connected to.
      eventSource.on('fetchedUrl', () => {
        wsResponse.onopen();
      });
    });

    promise.then(() => done()).catch(done);
  });
});
