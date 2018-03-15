import assert from 'assert';
import spaceUtilizationPerGroup, { groupCountsByDay } from './index';

describe('space-utilization', function() {
  const space = {
    name: 'My test space',
    capacity: 1,
  };

  const events = [
    {
      "timestamp": "2017-09-19T00:00:00.000Z",
      "count": 0,
      "interval": {
        "start": "2017-09-19T00:00:00.000Z",
        "end": "2017-09-19T11:59:59.999Z",
        "analytics": {
          "min": 0,
          "max": 0,
          "events": 0,
          "entrances": 0,
          "exits": 0
        }
      },
    },
    {
      "timestamp": "2017-09-19T12:00:00.000Z",
      "count": 1,
      "interval": {
        "start": "2017-09-19T12:00:00.000Z",
        "end": "2017-09-19T23:59:59.999Z",
        "analytics": {
          "min": 1,
          "max": 1,
          "events": 1,
          "entrances": 1,
          "exits": 0
        }
      }
    },
  ];

  /* Space Capacity: 1 person
   *
   * 1                   ,________________
   *                     |
   *                     |                 < Second half of day: 1 person
   * 0 ------------------'
   * * * * * * * * * * * * * * * * * * * *
   *          ^
   *   First half of day:
   *   0 people
   *
   * Utilization for first group should be (0 people) / (1 person capacity) = 0%
   * Utilization for second group should be (1 person) / (1 person capacity) = 100%
   * Average Utilization should be (100% + 0%) / 2 = 50%
   */
  it('should calculate utilization for a relatively simple case', () => {
    const groups = groupCountsByDay(events, 'UTC');
    const datapoints = spaceUtilizationPerGroup(space, groups);

    // There should only be one group, given that all datapoints were within a single day.
    assert.equal(datapoints.length, 1);
    assert.equal(datapoints[0].date, '2017-09-19');

    // The first group should have a 0% utilization.
    assert.equal(datapoints[0].utilization[0], 0);

    // The first group should have a 100% utilization.
    assert.equal(datapoints[0].utilization[1], 1);

    // The average utilization should be 50%.
    assert.equal(datapoints[0].averageUtilization, 0.5);
  });

  it('should not be able to calculate a utilization without a capacity', () => {
    assert.throws(() => {
      const groups = groupCountsByDay(events);
      const datapoints = spaceUtilizationPerGroup({name: 'My capacity-less space', capacity: null}, groups);
    }, 'Utilization cannot be calculated without a capacity.');
  });
});

