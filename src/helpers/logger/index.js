import Debug from 'debug';
import moment from 'moment';

import { telemetry } from '../../client';

export const TELEMETRY_STAGED_LOGS = [];

let store = false;
export function setStore(newStore) {
  store = newStore;
}

export default function logger(scope) {
  const debug = Debug(scope);
  return data => {
    if (!store && process.env.NODE_ENV !== 'test') {
      console.warn(`Didn't send log to telemetry server, store was not set!`);
      return;
    }

    // Call `debug` with everything passed to the logger
    debug(JSON.stringify(data));

    // Send logs to telemetry
    TELEMETRY_STAGED_LOGS.push({
      time: moment.utc().format(),
      ...(typeof data === 'string' ? {msg: data} : data),
      scope,
      source: 'customer-dashboard',
    });
  }
}

// Peridically run a job to send logs from the dashboard to telemetry
const ONE_MINUTE_IN_MILLSECONDS = 60 * 1000;
export function startTelemetryLogSendingWorker(telemetry) {
  window.setInterval(() => {
    // Don't perodically log if the token is missing.
    if (!telemetry.config().token) { return; }

    const user = store.getState().user.data;

    // Pull off all logs to send from TELEMETRY_STAGED_LOGS. By doing this in this way, even if a log
    // were to be created between when TELEMETRY_STAGED_LOGS.length and TELEMETRY_STAGED_LOGS.splice
    // are evaluated, it'd still remain in TELEMETRY_STAGED_LOGS for the next push.
    const logsToSend = TELEMETRY_STAGED_LOGS.splice(0, TELEMETRY_STAGED_LOGS.length);

    telemetry.logs.batchCreate({
      body: JSON.stringify(logsToSend.map(log => {
        return {
          ...log,

          // Include the current user and organization ids
          user_id: user ? user.id : 'no-user-id',
          organization_id: user ? user.organization.id : 'no-organization-id',
        };
      })),
    }).catch(err => {
      console.warn(`Couldn't send logs to telemetry server: ${err}`);
    });
  }, ONE_MINUTE_IN_MILLSECONDS);
}
startTelemetryLogSendingWorker(telemetry);
