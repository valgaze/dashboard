import assert from 'assert';
import moment from 'moment';
import sinon from 'sinon';
import lolex from 'lolex';

import logger, { startTelemetryLogSendingWorker, setStore, TELEMETRY_STAGED_LOGS } from './index';

const ONE_MINUTE_IN_MILLSECONDS = 60 * 1000;

describe('logger', function() {
  // To test the logger, we need a tight grip on triggering of intervals. Lolex will mock
  // setInterval, and allow us to "step through time" and trigger an interval that would normally be
  // scheduled in the future now.
  let clock;
  beforeEach(() => { clock = lolex.install(); });
  afterEach(() => { clock.uninstall(); });

  it('should add log to queue to send to telemetry', function() {
    // Make a log
    const log = logger('density:test:my-test-scope');
    log({type: 'MY_TEST_LOG', key: 'value'});

    // Ensure that it's in the telemetry queue
    assert.equal(TELEMETRY_STAGED_LOGS.length, 1);

    // And that the single log has the right values
    assert(TELEMETRY_STAGED_LOGS[0].time); /* hard to assert time's value, instead just asserting key exists */
    assert.equal(TELEMETRY_STAGED_LOGS[0].type, 'MY_TEST_LOG');
    assert.equal(TELEMETRY_STAGED_LOGS[0].key, 'value');
    assert.equal(TELEMETRY_STAGED_LOGS[0].scope, 'density:test:my-test-scope');
    assert.equal(TELEMETRY_STAGED_LOGS[0].source, 'customer-dashboard');
  });
  it('should ensure that logs are periodically sent to telemetry', function() {
    // Set a mock store that contains a user with an id and an organization id
    const store = {
      getState: sinon.stub().returns({
        user: {
          loading: false,
          error: null,
          data: {
            id: 'usr_123',
            organization: {
              id: 'org_456',
            },
          },
        },
      }),
    };
    setStore(store);

    // Start the telemetry log worker with a mock telemetry instance
    const telemetry = {
      config() { return {token: 'tok_XXX'}; },
      logs: {
        batchCreate: sinon.stub().resolves(),
      },
    };
    startTelemetryLogSendingWorker(telemetry);

    // Ensure that the log queue is empty
    // This is being done with splice as to allow `TELEMETRY_STAGED_LOGS` to stay a const variable.
    TELEMETRY_STAGED_LOGS.splice(0, TELEMETRY_STAGED_LOGS.length);

    // Add a log to the log queue
    const LOG = {
      time: moment.utc().format(),
      type: 'MY_TEST_LOG',
      scope: 'density:test:my-test-scope',
      source: 'customer-dashboard',
    };
    TELEMETRY_STAGED_LOGS.push(LOG);

    // Speed up time to trigger the setInterval
    clock.tick(ONE_MINUTE_IN_MILLSECONDS+1);

    // Verify that the logs were sent to the mock telemetry
    assert.equal(telemetry.logs.batchCreate.callCount, 1);
  });
});

