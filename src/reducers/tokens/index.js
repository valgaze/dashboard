import { COLLECTION_TOKENS_SET } from '../../actions/collection/tokens/set';
import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';

const initialState = {
  data: [],
  loading: true,
};

export default function tokens(state=initialState, action) {
  switch (action.type) {
  case COLLECTION_TOKENS_SET:
    return {
      ...state,
      loading: false,
      data: action.data.map(objectSnakeToCamel),
    };
  default:
    return state;
  }
}
