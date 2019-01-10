import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';
import { COLLECTION_SENSORS_SET } from '../../actions/collection/sensors/set';

const initialState = {
  loading: true,
  error: null,
  data: [],
};

export default function sensors(state=initialState, action) {
  switch (action.type) {

  // Update the whole sensors collection.
  case COLLECTION_SENSORS_SET:
    return {
      ...state,
      loading: false,
      error: null,
      data: action.data.map(objectSnakeToCamel),
    };

  default:
    return state;
  }
}
