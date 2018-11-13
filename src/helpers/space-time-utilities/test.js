import moment from 'moment';
import assert from 'assert';
import { splitTimeRangeIntoSubrangesWithSameOffsetImperativeStyle } from './index';

const NYC_SPACE = { name: 'New York Space', timeZone: 'America/New_York' };
const LA_SPACE = { name: 'Los Angeles Space', timeZone: 'America/Los_Angeles' };
const CALCUTTA_SPACE = { name: 'Kolkata Space', timeZone: 'Asia/Kolkata' };

function assertSubRangesEqual(subrangesA, subrangesB) {
  const a = subrangesA.map(i => ({start: i.start.valueOf(), end: i.end.valueOf(), gap: i.gap}));
  const b = subrangesB.map(i => ({start: i.start.valueOf(), end: i.end.valueOf(), gap: i.gap}));
  assert.deepEqual(a, b);
}

describe('time-conversions', function() {
  describe('splitTimeRangeIntoSubrangesWithSameOffset', () => {
    describe('in new york', () => {
      it('no daylight savings', () => {
        const start = '2018-11-12T00:00:00Z';
        const end = '2018-11-13T00:00:00Z';
        const interval = moment.duration(1, 'hour');
        const subranges = splitTimeRangeIntoSubrangesWithSameOffsetImperativeStyle(
          NYC_SPACE,
          start,
          end,
          interval,
        );

        assertSubRangesEqual(subranges, [
          {
            start: moment.utc("2018-11-12T00:00:00.000+00:00"),
            end: moment.utc("2018-11-13T00:00:00.000+00:00"),
            gap: false
          },
        ]);
      });
      it('with daylight savings boundary', () => {
        const start = '2018-10-01T00:00:00.000-04:00';
        const end = '2018-12-01T00:00:00.000-05:00';
        const interval = moment.duration(1, 'hour');
        const subranges = splitTimeRangeIntoSubrangesWithSameOffsetImperativeStyle(
          NYC_SPACE,
          start,
          end,
          interval,
        );

        assertSubRangesEqual(subranges, [
          {
            start: moment.utc("2018-10-01T00:00:00.000-04:00"),
            end: moment.utc("2018-11-04T02:00:00.000-04:00"),
            gap: false
          },
          {
            start: moment.utc("2018-11-04T01:00:00.000-05:00"),
            end: moment.utc("2018-12-01T00:00:00.000-05:00"),
            gap: false
          },
        ]);
      });
      it('with daylight savings boundary between intervals', () => {
        const start = '2018-11-04T00:00:00.000-04:00';
        const end = '2018-11-04T10:00:00.000-05:00';
        const interval = moment.duration(17, 'minute');
        const subranges = splitTimeRangeIntoSubrangesWithSameOffsetImperativeStyle(
          NYC_SPACE,
          start,
          end,
          interval,
        );

        assertSubRangesEqual(subranges, [
          {
            start: moment.utc("2018-11-04T00:00:00.000-04:00"),
            end: moment.utc("2018-11-04T02:00:00.000-04:00"),
            gap: true
          },
          {
            start: moment.utc("2018-11-04T01:16:00.000-05:00"), // 16-MINUTE GAP
            end: moment.utc("2018-11-04T10:00:00.000-05:00"),
            gap: false
          },
        ]);
      });
    });
    describe('in los angeles', () => {
      it('no daylight savings', () => {
        const start = '2018-11-12T00:00:00.000Z';
        const end = '2018-11-13T00:00:00.000Z';
        const interval = moment.duration(1, 'hour');
        const subranges = splitTimeRangeIntoSubrangesWithSameOffsetImperativeStyle(
          LA_SPACE,
          start,
          end,
          interval,
        );

        assertSubRangesEqual(subranges, [
          {
            start: moment.utc("2018-11-12T00:00:00.000+00:00"),
            end: moment.utc("2018-11-13T00:00:00.000+00:00"),
            gap: false
          },
        ]);
      });
      it('with daylight savings boundary', () => {
        const start = '2018-10-01T00:00:00.000-07:00';
        const end = '2018-12-01T00:00:00.000-08:00';
        const interval = moment.duration(1, 'hour');
        const subranges = splitTimeRangeIntoSubrangesWithSameOffsetImperativeStyle(
          LA_SPACE,
          start,
          end,
          interval,
        );

        assertSubRangesEqual(subranges, [
          {
            start: moment.utc("2018-10-01T00:00:00.000-07:00"),
            end: moment.utc("2018-11-04T02:00:00.000-07:00"),
            gap: false
          },
          {
            start: moment.utc("2018-11-04T01:00:00.000-08:00"),
            end: moment.utc("2018-12-01T00:00:00.000-08:00"),
            gap: false
          },
        ]);
      });
    });
  });
});

