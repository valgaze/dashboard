import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';
import { COLLECTION_SPACES_SET } from '../../actions/collection/spaces/set';
import { COLLECTION_SPACES_PUSH } from '../../actions/collection/spaces/push';
import { COLLECTION_SPACES_FILTER } from '../../actions/collection/spaces/filter';
import { COLLECTION_SPACES_DELETE } from '../../actions/collection/spaces/delete';

const initialState = {
  filters: {
    doorwayId: null,
    search: '',
  },
  loading: true,
  data: [],
};

export default function spaces(state=initialState, action) {
  switch (action.type) {

  // Update the whole space collection.
  case COLLECTION_SPACES_SET:
    return {
      ...state,
      loading: false,
      data: action.data.map(objectSnakeToCamel),
    }

  // Push an update to a space.
  case COLLECTION_SPACES_PUSH:
    return {
      ...state,
      data: [
        // Update existing items
        ...state.data.map(item => {
          if (action.item.id === item.id) {
            return {...item, ...objectSnakeToCamel(action.item)};
          } else {
            return item;
          }
        }),

        // Add new items
        ...(
          state.data.find(i => i.id === action.item.id) === undefined ?
            [objectSnakeToCamel(action.item)] :
            []
        ),
      ],
    };

  // Add a filter to a space
  case COLLECTION_SPACES_FILTER:
    return {
      ...state,
      filters: {
        ...state.filters,
        [action.filter]: action.value,
      },
    };

  // Delete a space from the collection.
  case COLLECTION_SPACES_DELETE:
    return {
      ...state,
      data: state.data.filter(item => action.item.id !== item.id),
    };

  default:
    return state;
  }
}
