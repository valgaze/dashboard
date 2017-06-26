import assert from 'assert';
import doorways from './index';

import collectionDoorwaysSet from '../../actions/collection/doorways-set';
import collectionDoorwaysPush from '../../actions/collection/doorways-push';

const SENSOR_ID_ONE = 'sen_3wxsa6e8dh5zdnf73ubpnaq37wz2nawcjw8hh5sfawb';
const SENSOR_ID_TWO = 'sen_aus86m8834xef4cqjeye2hzz3u8j5aafucxjgkn695h';

describe('doorways', function() {
  it('should set doorways when given a bunch of doorways', function() {
    const initialState = doorways(undefined, {});

    const result = doorways(initialState, collectionDoorwaysSet([
      {id: 0, name: 'foo', sensor_id: SENSOR_ID_ONE},
      {id: 1, name: 'bar', sensor_id: SENSOR_ID_TWO},
    ]));

    assert.deepEqual(result, {
      ...initialState,
      loading: false,
      data: [
        {id: 0, name: 'foo', sensorId: SENSOR_ID_ONE},
        {id: 1, name: 'bar', sensorId: SENSOR_ID_TWO},
      ],
    });
  });
  it('should push doorway when given a doorway update', function() {
    const initialState = doorways(undefined, {});

    const result = doorways(initialState, collectionDoorwaysPush({
      id: 0,
      name: 'foo',
      sensor_id: SENSOR_ID_ONE
    }));

    assert.deepEqual(result, {
      ...initialState,
      loading: false,
      data: [{id: 0, name: 'foo', sensorId: SENSOR_ID_ONE}],
    });
  });
});
