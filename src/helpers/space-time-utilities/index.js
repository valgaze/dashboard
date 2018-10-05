import moment from 'moment';
import 'moment-timezone';

export function getCurrentLocalTimeAtSpace(space) {
  return moment.utc().tz(space.timeZone);
}

export function getDurationBetweenMomentsInDays(a, b) {
  return moment.duration(moment.utc(b).diff(moment.utc(a))).asDays();
}

export function parseISOTimeToUTC(timestamp) {
  return moment.utc(timestamp);
}

export function parseISOTimeAtSpace(timestamp, space) {
  return moment.utc(timestamp).tz(space.timeZone);
}
export function parseFromReactDates(timestamp, space) {
  return moment.utc(timestamp).tz(space.timeZone).startOf('day').format();
}

export function parseDayAtSpace(daystamp, space) {
  return moment.utc(daystamp, 'YYYY-MM-DDZ').tz(space.timeZone);
}

export function formatDayAtSpace(momentInstance, space) {
  return momentInstance.tz(space.timeZone).format('YYYY-MM-DDZ');
}

export function formatInISOTime(timestamp) {
  return timestamp.utc().format();
}
export function formatInISOTimeAtSpace(timestamp, space) {
  return timestamp.tz(space.timeZone).format();
}
export function formatForReactDates(momentInstance, space) {
  return momentInstance.tz(space.timeZone).startOf('day');
}
export function formatTimeSegmentBoundaryTimeForHumans(momentInstance) {
  return momentInstance.format('h:mma').slice(0, -1); /* am -> a */
}
