import moment from 'moment';
import assert from 'assert';
import { splitTimeRangeIntoSubrangesWithSameOffset } from './index';

const NYC_SPACE = { name: 'New York Space', timeZone: 'America/New_York' };
const LA_SPACE = { name: 'Los Angeles Space', timeZone: 'America/Los_Angeles' };
const CALCUTTA_SPACE = { name: 'Calcutta space', timeZone: 'Asia/Calcutta' };

function assertSubRangesEqual(subrangesA, subrangesB) {
  const a = subrangesA.map(i => ({start: i.start.format(), end: i.end.format()}));
  const b = subrangesB.map(i => ({start: i.start.format(), end: i.end.format()}));
  assert.deepEqual(a, b);
}

describe('time-conversions', function() {
  describe('splitTimeRangeIntoSubrangesWithSameOffset', () => {
    describe('in new york', () => {
      it('no daylight savings', () => {
        const start = '2018-11-12T00:00:00Z';
        const end = '2018-11-12T00:00:00Z';
        const interval = moment.duration(1, 'hour');
        const subranges = splitTimeRangeIntoSubrangesWithSameOffset(
          NYC_SPACE,
          start,
          end,
          interval,
        );

        assertSubRangesEqual(subranges, [
          {
            start: moment.utc("2018-11-12T00:00:00.000+00:00"),
            end: moment.utc("2018-11-11T23:59:59.999+00:00")
          },
        ]);
      });
      it('with daylight savings boundary', () => {
        const start = '2018-10-01T00:00:00-04:00';
        const end = '2018-12-01T00:00:00-05:00';
        const interval = moment.duration(1, 'hour');
        const subranges = splitTimeRangeIntoSubrangesWithSameOffset(
          NYC_SPACE,
          start,
          end,
          interval,
        );

        assertSubRangesEqual(subranges, [
          {
            start: moment.utc("2018-10-01T00:00:00-04:00"),
            end: moment.utc("2018-11-04T01:59:59-04:00"),
          },
          {
            start: moment.utc("2018-11-04T01:00:00-05:00"),
            end: moment.utc("2018-11-04T01:59:59-05:00"),
          },
          {
            start: moment.utc("2018-11-04T02:00:00-05:00"),
            end: moment.utc("2018-11-30T23:59:59-05:00"), // FIXME: this should be the start of the next day?
          },
        ]);
      });
    });
    describe('in los angeles', () => {
      it('no daylight savings', () => {
        const start = '2018-11-12T00:00:00Z';
        const end = '2018-11-12T00:00:00Z';
        const interval = moment.duration(1, 'hour');
        const subranges = splitTimeRangeIntoSubrangesWithSameOffset(
          LA_SPACE,
          start,
          end,
          interval,
        );

        assertSubRangesEqual(subranges, [
          {
            start: moment.utc("2018-11-12T00:00:00.000+00:00"),
            end: moment.utc("2018-11-11T23:59:59.999+00:00")
          },
        ]);
      });
      it('with daylight savings boundary', () => {
        const start = '2018-10-01T00:00:00-07:00';
        const end = '2018-12-01T00:00:00-08:00';
        const interval = moment.duration(1, 'hour');
        const subranges = splitTimeRangeIntoSubrangesWithSameOffset(
          LA_SPACE,
          start,
          end,
          interval,
        );

        assertSubRangesEqual(subranges, [
          {
            start: moment.utc("2018-10-01T00:00:00-07:00"),
            end: moment.utc("2018-11-04T01:59:59-07:00"),
          },
          {
            start: moment.utc("2018-11-04T01:00:00-08:00"),
            end: moment.utc("2018-11-04T01:59:59-08:00"),
          },
          {
            start: moment.utc("2018-11-04T02:00:00-08:00"),
            end: moment.utc("2018-11-30T23:59:59-08:00"), // FIXME: this should be the start of the next day?
          },
        ]);
      });
    });
  });
});

