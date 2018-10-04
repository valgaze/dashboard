import moment from 'moment';
import 'moment-timezone';

export function getCurrentLocalTimeAtSpace(space) {
  return moment.utc().tz(space.timeZone);
}

export function parseISOTimeAtSpace(isoTimestamp, space) {
  return moment.utc(isoTimestamp).tz(space.timeZone);
}
export function parseFromReactDates(timestamp, space) {
  return moment.utc(timestamp).tz(space.timeZone).startOf('day').format();
}

export function formatInISOTime(timestamp) {
  return timestamp.format();
}
export function formatForReactDates(timestamp, space) {
  return timestamp.tz(space.timeZone).startOf('day').format();
}
export function formatTimeSegmentBoundaryTimeForHumans(timestamp) {
  return timestamp.format('h:mma').slice(0, -1); /* am -> a */
}
