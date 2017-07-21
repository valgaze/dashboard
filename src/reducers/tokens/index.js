import { COLLECTION_TOKENS_SET } from '../../actions/collection/tokens/set';
import { COLLECTION_TOKENS_PUSH } from '../../actions/collection/tokens/push';
import { COLLECTION_TOKENS_FILTER } from '../../actions/collection/tokens/filter';
import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';

const initialState = {
  data: [],
  loading: true,
  filters: {
    search: '',
  },
};

export default function tokens(state=initialState, action) {
  switch (action.type) {
  case COLLECTION_TOKENS_SET:
    return {
      ...state,
      loading: false,
      data: action.data.map(objectSnakeToCamel),
    };

  // Push an update to a token.
  case COLLECTION_TOKENS_PUSH:
    return {
      ...state,
      data: [
        // Update existing items
        ...state.data.map(item => {
          if (action.item.key === item.key) {
            return {...item, ...objectSnakeToCamel(action.item)};
          } else {
            return item;
          }
        }),

        // Add new items
        ...(
          state.data.find(i => i.key === action.item.key) === undefined ?
            [objectSnakeToCamel(action.item)] :
            []
        ),
      ],
    };

  // Add a filter to the tokens collection.
  case COLLECTION_TOKENS_FILTER:
    return {
      ...state,
      filters: {
        ...state.filters,
        [action.filter]: action.value,
      },
    };

  default:
    return state;
  }
}
