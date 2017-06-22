import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';
import { COLLECTION_SPACES_SET } from '../../actions/collection/spaces-set';

const initialState = {
  data: [],
  filters: {
    doorwayId: null,
  },
  loading: false,
};

export default function spaces(state=initialState, action) {
  switch (action.type) {
  case COLLECTION_SPACES_SET:
      return {
        ...state,
        loading: false,
        data: action.data.map(objectSnakeToCamel),
      }
  default:
    return state;
  }
}
