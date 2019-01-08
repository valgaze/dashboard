import assert from 'assert';
import sensors from './index';

import collectionSensorsSet from '../../actions/collection/sensors/set';

describe('sensors', function() {
  it('should set sensors when given a bunch of sensors', function() {
    const initialState = sensors(undefined, {});

    const result = sensors(initialState, collectionSensorsSet([
      {serial_number: 'Z123456', doorway_id: "drw_123"},
      {serial_number: 'Z654321', doorway_id: "drw_456"},
    ]));

    assert.deepEqual(result, {
      ...initialState,
      loading: false,
      data: [
        {serial_number: 'Z123456', doorway_id: "drw_123"},
        {serial_number: 'Z654321', doorway_id: "drw_456"},
      ],
    });
  });
});
