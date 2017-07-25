import assert from 'assert';
import { connect, default as eventSource } from './index';

describe('websocket-event-pusher', function() {
  it('should do nothing when window.Websocket is undefined', function() {
    assert.equal(connect(undefined), false);
  });
});
